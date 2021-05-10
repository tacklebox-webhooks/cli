const { db, queries } = require("./db");
const { newResponse } = require("./utils");
const AWS = require("aws-sdk");
const sns = new AWS.SNS({ apiVersion: "2010-03-31" });

const resendMessage = async (messageUuid, serviceUuid) => {
  try {
    const message = await getMessageToResend(messageUuid);
    if (!message) {
      return newResponse(404, {
        error_type: "data_not_found",
        detail: "No message matches given uuid.",
      });
    }

    const resend_arn = await getResendArn(serviceUuid);
    const params = createParams(message, resend_arn);
    await sns.publish(params).promise();
    return newResponse(202, {});
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not resend message.",
    });
  }
};

const getMessageToResend = async (messageUuid) => {
  const text = queries.getMessageToResend;
  const values = [messageUuid];

  const response = await db.query(text, values);
  const message = response.rows[0];
  return message;
};

const getResendArn = async (serviceUuid) => {
  const queryString = queries.getResendArn;
  const response = await db.query(queryString);
  let eventType = response.rows[0];

  if (eventType) {
    return eventType.sns_topic_arn;
  }
};

const createParams = (message, resend_arn) => {
  const { endpoint, payload } = message;
  return {
    TopicArn: resend_arn,
    Message: JSON.stringify(payload),
    MessageAttributes: {
      endpoint_url: {
        DataType: "String",
        StringValue: endpoint,
      },
    },
  };
};

const getMessage = async (messageUuid) => {
  const text = queries.getMessage;
  const values = [messageUuid];

  try {
    const response = await db.query(text, values);
    const message = response.rows[0];

    if (!message) {
      return newResponse(404, {
        error_type: "data_not_found",
        detail: "No message matches given uuid.",
      });
    }

    return newResponse(200, message);
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not get message.",
    });
  }
};

const listMessages = async (userUuid) => {
  const text = queries.listMessages;
  const values = [userUuid];

  try {
    const response = await db.query(text, values);
    let responseBody = response.rows;
    return newResponse(200, responseBody);
  } catch (error) {
    console.error(error);
    return newResponse(500, {
      error_type: "process_failed",
      detail: "Could not get messages.",
    });
  }
};

module.exports = {
  getMessage,
  resendMessage,
  listMessages,
};
