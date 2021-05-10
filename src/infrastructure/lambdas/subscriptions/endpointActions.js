const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const sns = new AWS.SNS({ apiVersion: "2010-03-31" });
const { db, queries } = require("./db");
const { uuidToId, newResponse } = require("./utils");

const listEndpoints = async (userUuid) => {
  const text = queries.listEndpoints;
  const values = [userUuid];

  try {
    const response = await db.query(text, values);
    let responseBody = response.rows;
    return newResponse(200, responseBody);
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not get subscriptions.",
    });
  }
};

const createEndpoint = async (userUuid, url, eventTypes) => {
  if (!eventTypes || eventTypes.length === 0 || !url) {
    return newResponse(400, {
      error_type: "missing_parameter",
      detail: "'url' and a non-empty 'eventTypes' list are required.",
    });
  }

  const userId = await uuidToId("users", userUuid);

  // Create endpoint in DB

  let endpoint;

  try {
    const text = queries.saveEndpointToDb;
    const values = [userId, url];
    const response = await db.query(text, values);
    endpoint = response.rows[0];
    endpoint.eventTypes = [];
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not create subscription.",
    });
  }

  // Subscribe endpoint to each specified event type
  for (let i = 0; i < eventTypes.length; i += 1) {
    let eventTypeName = eventTypes[i];
    let eventTypeInfo;

    try {
      const response = await getEventTypeInfo(eventTypeName);
      eventTypeInfo = response;
    } catch (error) {
      console.error(error);
      continue;
    }
    const FilterPolicy = JSON.stringify({ user_uuid: [userUuid] });

    const snsAttributes = {
      RawMessageDelivery: "true",
      FilterPolicy,
    };

    const snsParams = {
      Protocol: "https",
      TopicArn: eventTypeInfo.sns_topic_arn,
      Attributes: snsAttributes,
      Endpoint: endpoint.url,
      ReturnSubscriptionArn: true,
    };

    try {
      console.log("Subscribing endpoint to SNS topic");
      const subscription = await sns.subscribe(snsParams).promise();

      const query = queries.saveSubscriptionToDb;
      const queryValues = [
        endpoint.id,
        eventTypeInfo.id,
        subscription.SubscriptionArn,
      ];

      const subResponse = await db.query(query, queryValues);
      endpoint.eventTypes.push(eventTypeName);
      const sub = subResponse.rows[0];
    } catch (error) {
      console.error(error);
      continue;
    }
  }

  const { id, ...endpointCopy } = endpoint;
  return newResponse(201, endpointCopy);
};

const getEventTypeInfo = async (name) => {
  const text = queries.getEventTypeInfoFromName;
  const values = [name];

  const response = await db.query(text, values);
  const eventType = response.rows[0];
  return eventType;
};

const getEndpoint = async (endpointUuid) => {
  const text = queries.getEndpoint;
  const values = [endpointUuid];

  try {
    const response = await db.query(text, values);
    const endpoint = response.rows[0];

    if (!endpoint) {
    }

    return newResponse(200, endpoint);
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not get subscription.",
    });
  }
};

const updateEndpoint = async (endpointUuid, userUuid, event_types) => {
  if (!event_types || event_types.length === 0) {
    return newResponse(400, {
      error_type: "missing_parameter",
      detail: "a non-empty 'event_types' list is required.",
    });
  }

  const endpoint = await getEndpointData(endpointUuid);
  if (!endpoint) {
    return newResponse(404, {
      error_type: "data_not_found",
      detail: "No subscription matches given uuid.",
    });
  }

  try {
    const subscriptions = await getSubscriptions(endpoint.uuid);
    const { toDelete, toAdd } = extractChanges(subscriptions, event_types);
    const removed = await removeSubscriptions(toDelete);
    const added = await addSubscriptions(toAdd, endpoint, userUuid);
    const updatedEndpoint = formatEndpoint(
      endpoint,
      subscriptions,
      removed,
      added
    );
    return newResponse(202, updatedEndpoint);
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not update subscription.",
    });
  }
};

const getEndpointData = async (endpointUuid) => {
  const text = queries.getEndpointData;
  const values = [endpointUuid];

  try {
    const response = await db.query(text, values);
    const endpoint = response.rows[0];
    return endpoint;
  } catch (error) {
    console.error(error);
    return;
  }
};

const getSubscriptions = async (endpointUuid) => {
  const text = queries.getSubscriptions;
  const values = [endpointUuid];
  const response = await db.query(text, values);
  return response.rows;
};

const extractChanges = (subscriptions, event_types) => {
  const toDelete = subscriptions.filter(
    (subscription) => !event_types.includes(subscription.name)
  );
  const toAdd = event_types.filter((event_type) => {
    return !subscriptions.find((subscription) => {
      return subscription.name === event_type;
    });
  });

  return { toDelete, toAdd };
};

const removeSubscriptions = async (subscriptions) => {
  const removed = [];

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await removeSubscriptionFromSNS(subscription.subscription_arn);
        await removeSubscriptionFromDb(subscription.subscription_arn);
        removed.push(subscription.name);
      } catch (error) {
        console.error(error);
      }
    })
  );

  return removed;
};

const removeSubscriptionFromSNS = async (subscriptionArn) => {
  const snsParams = { SubscriptionArn: subscriptionArn };
  await sns.unsubscribe(snsParams).promise();
};

const removeSubscriptionFromDb = async (subscriptionArn) => {
  const text = queries.deleteSubscription;
  const values = [subscriptionArn];
  await db.query(text, values);
};

const addSubscriptions = async (subscriptions, endpoint, userUuid) => {
  const added = [];

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        const eventType = await getEventTypeInfo(subscription);
        const subscriptionData = await addSubscriptionToSNS(
          userUuid,
          eventType.sns_topic_arn,
          endpoint.url
        );
        await addSubscriptionToDb(
          endpoint.id,
          eventType.id,
          subscriptionData.SubscriptionArn
        );
        added.push(subscription);
      } catch (error) {
        console.error(error);
        return;
      }
    })
  );

  return added;
};

const addSubscriptionToSNS = async (userUuid, snsTopicArn, url) => {
  const snsParams = await newSubscriptionParams(userUuid, snsTopicArn, url);
  const response = await sns.subscribe(snsParams).promise();
  return response;
};

const addSubscriptionToDb = async (
  endpointId,
  eventTypeId,
  subscriptionArn
) => {
  const text = queries.saveSubscriptionToDb;
  const values = [endpointId, eventTypeId, subscriptionArn];
  await db.query(text, values);
};

const newSubscriptionParams = async (userUuid, sns_topic_arn, url) => {
  const FilterPolicy = JSON.stringify({ user_uuid: [userUuid] });
  const snsAttributes = {
    RawMessageDelivery: "true",
    FilterPolicy,
  };

  return {
    Protocol: "https",
    TopicArn: sns_topic_arn,
    Attributes: snsAttributes,
    Endpoint: url,
    ReturnSubscriptionArn: true,
  };
};

const formatEndpoint = (endpoint, subscriptions, removed, added) => {
  subscriptions = subscriptions.map((subscription) => subscription.name);
  subscriptions = subscriptions.filter(
    (subscription) => !removed.includes(subscription)
  );
  subscriptions = [...subscriptions, ...added];

  return {
    uuid: endpoint.uuid,
    url: endpoint.url,
    created_at: endpoint.created_at,
    eventTypes: subscriptions,
  };
};

// TODO: Set matching subscriptions as deleted
// const deleteEndpoint = async (endpointUuid) => {
//   // const text =
//   // "UPDATE endpoints SET deleted_at = NOW() WHERE uuid = $1 AND deleted_at IS NULL RETURNING sns_topic_arn";

//   const text = queries.deleteEndpoint;
//   const values = [endpointUuid];

//   try {
//     const response = await db.query(text, values);

//     if (response.rows.length === 0) {
//       return newResponse(404, {
//         error_type: "data_not_found",
//         detail: "No subscription matches given uuid.",
//       });
//     }

//     return newResponse(204, {});
//   } catch (error) {
//     console.log(error);
//     return newResponse(500, {
//       error_type: "process_failed",
//       detail: "Could not delete subscription.",
//     });
//   }
// };

module.exports = {
  listEndpoints,
  createEndpoint,
  // deleteEndpoint,
  getEndpoint,
  updateEndpoint,
};
