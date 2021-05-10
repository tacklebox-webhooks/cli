"use strict";
const { getMessage, resendMessage, listMessages } = require("./messageActions");
const { newResponse, isValidService, isValidUser } = require("./utils");

exports.handler = async (event) => {
  let { pathParameters, httpMethod, resource } = event;
  const isResend =
    resource ===
    "/services/{service_id}/users/{user_id}/messages/{message_id}/resend";
  const messageUuid = pathParameters
    ? pathParameters.message_id
    : pathParameters;

  const userUuid = pathParameters ? pathParameters.user_id : pathParameters;
  if (!(await isValidUser(userUuid))) {
    return newResponse(404, {
      error_Type: "data_not_found",
      detail: "No user matches given uuid.",
    });
  }

  const serviceUuid = pathParameters
    ? pathParameters.service_id
    : pathParameters;
  if (!(await isValidService(serviceUuid))) {
    return newResponse(404, {
      error_Type: "data_not_found",
      detail: "No service matches given uuid.",
    });
  }

  if (isResend && httpMethod === "POST") {
    return await resendMessage(messageUuid, serviceUuid);
  } else if (messageUuid && httpMethod === "GET") {
    return await getMessage(messageUuid);
  } else if (httpMethod === "GET") {
    return await listMessages(userUuid);
  }
};
