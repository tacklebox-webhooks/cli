const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const sns = new AWS.SNS({ apiVersion: "2010-03-31" });
const cwlogs = new AWS.CloudWatchLogs({ apiVersion: "2014-03-28" });
const lambda = new AWS.Lambda({ apiVersion: "2015-03-31" });
const { db, queries } = require("./db");
const { newResponse, uuidToId, isValidEventTypeName } = require("./utils");

const createEventType = async (name, serviceUuid) => {
  if (!name) {
    return newResponse(400, {
      error_type: "missing_parameter",
      detail: "'name' is required.",
    });
  } else if (!isValidEventTypeName(name)) {
    return newResponse(400, {
      error_type: "invalid_parameter",
      detail:
        "'name' is limited to 50 characters, and can contain alphanumeric characters, hyphens, and underscores.",
    });
  }

  const serviceId = await uuidToId("services", serviceUuid);
  const snsTopicName = `CaptainHook_${serviceUuid}_${name}`;
  const HTTPSuccessFeedbackRoleArn =
    "arn:aws:iam::946221510390:role/SNSSuccessFeedback";
  const HTTPFailureFeedbackRoleArn =
    "arn:aws:iam::946221510390:role/SNSFailureFeedback";
  const HTTPSuccessFeedbackSampleRate = "100";
  const DeliveryPolicy = {
    http: {
      defaultHealthyRetryPolicy: {
        minDelayTarget: 5,
        maxDelayTarget: 1200,
        numRetries: 10,
        numMaxDelayRetries: 0,
        numNoDelayRetries: 0,
        numMinDelayRetries: 0,
        backoffFunction: "exponential",
      },
      disableSubscriptionOverrides: true,
    },
  };

  const snsParams = {
    Name: snsTopicName,
    Attributes: {
      HTTPSuccessFeedbackRoleArn,
      HTTPFailureFeedbackRoleArn,
      HTTPSuccessFeedbackSampleRate,
      DeliveryPolicy: JSON.stringify(DeliveryPolicy),
    },
  };

  // CreateTopic is idempotent, so if topic with given name already
  // exists, it will return existing ARN.
  let TopicArn;

  try {
    const result = await sns.createTopic(snsParams).promise();
    TopicArn = result.TopicArn;
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  const region = "us-east-1";
  const accountId = "946221510390";
  const logGroupName = `sns/${region}/${accountId}/${snsTopicName}`;
  const logGroupNameFailure = `${logGroupName}/Failure`;
  const destinationArn = `arn:aws:lambda:${region}:${accountId}:function:CaptainHook_LogMessages`;

  // Create "success" log group, add permissions and lambda trigger
  try {
    await cwlogs.createLogGroup({ logGroupName: logGroupName }).promise();

    // Add permissions to logMessage lambda
    const lambdaParams = {
      Action: "lambda:InvokeFunction",
      FunctionName: "CaptainHook_LogMessages",
      Principal: `logs.${region}.amazonaws.com`,
      SourceArn: `arn:aws:logs:${region}:${accountId}:log-group:${logGroupName}:*`,
      StatementId: `${snsTopicName}SuccessTrigger`,
    };

    const lambdaResult = await lambda.addPermission(lambdaParams).promise();
    console.log(lambdaResult);
    // Tell log group to invoke lambda
    const subscriptionFilterParams = {
      destinationArn,
      filterName: lambdaParams.StatementId,
      filterPattern: "",
      logGroupName,
    };

    const cwlogsResponse = await cwlogs
      .putSubscriptionFilter(subscriptionFilterParams)
      .promise();

    console.log(cwlogsResponse);
  } catch (error) {
    console.error(
      "Unable to send Create Log Group Request. Error JSON:",
      error
    );
  }

  // Create "failure" log group, add permissions and lambda trigger
  try {
    await cwlogs
      .createLogGroup({ logGroupName: logGroupNameFailure })
      .promise();
    const lambdaParams = {
      Action: "lambda:InvokeFunction",
      FunctionName: "CaptainHook_LogMessages",
      Principal: `logs.${region}.amazonaws.com`,
      SourceArn: `arn:aws:logs:${region}:${accountId}:log-group:${logGroupNameFailure}:*`,
      StatementId: `${snsTopicName}FailureTrigger`,
    };

    const lambdaResult = await lambda.addPermission(lambdaParams).promise();
    console.log(lambdaResult);
    // Tell log group to invoke lambda
    const subscriptionFilterParams = {
      destinationArn,
      filterName: lambdaParams.StatementId,
      filterPattern: "",
      logGroupName: logGroupNameFailure,
    };

    const cwlogsResponse = await cwlogs
      .putSubscriptionFilter(subscriptionFilterParams)
      .promise();

    console.log(cwlogsResponse);
  } catch (error) {
    console.error(error);
  }

  const text = queries.createEventType;
  const values = [name, serviceId, TopicArn];

  try {
    const response = await db.query(text, values);
    const eventType = response.rows[0];
    return newResponse(201, eventType);
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not create event type.",
    });
  }
};

const listEventTypes = async (serviceUuid) => {
  const text = queries.listEventTypes;
  const values = [serviceUuid];

  try {
    const response = await db.query(text, values);
    let eventTypes = response.rows;
    return newResponse(200, eventTypes);
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not get event types.",
    });
  }
};

const getEventType = async (eventTypeId) => {
  const text = queries.getEventType;
  const values = [eventTypeId];

  try {
    const response = await db.query(text, values);
    const eventType = response.rows[0];

    if (!eventType) {
      return newResponse(404, {
        error_type: "data_not_found",
        detail: "No event type matches given uuid.",
      });
    }

    console.log("Here");
    const topic = await sns
      .getTopicAttributes({
        TopicArn: eventType.sns_topic_arn,
      })
      .promise();

    eventType.DeliveryPolicy = JSON.parse(
      topic.Attributes.EffectiveDeliveryPolicy
    );

    const { sns_topic_arn, ...formattedEventType } = eventType;
    return newResponse(200, formattedEventType);
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not get event type.",
    });
  }
};

// TODO: Set matching subscriptions as deleted
const deleteEventType = async (serviceUuid, eventTypeId) => {
  const text = queries.deleteEventType;
  const values = [eventTypeId];

  try {
    const response = await db.query(text, values);
    const eventType = response.rows[0];

    if (!eventType) {
      return newResponse(404, {
        error_type: "data_not_found",
        detail: "No event type matches given uuid.",
      });
    }

    const { sns_topic_arn } = eventType; // Pull event topic ARN from DB response
    const snsParams = { TopicArn: sns_topic_arn };

    // "This action is idempotent, so deleting a topic that does not exist does not result in an error."
    const result = await sns.deleteTopic(snsParams).promise();

    return newResponse(204, { Success: "Event type was deleted" });
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not delete event type.",
    });
  }
};

module.exports = {
  deleteEventType,
  getEventType,
  createEventType,
  listEventTypes,
};
