"use strict";
const { getEvent, createEvent, listEvents } = require("./eventActions");
const { newResponse, isValidService, isValidUser } = require("./utils");

exports.handler = async (event) => {
  let { pathParameters, httpMethod, body } = event;
  body = JSON.parse(body);
  const eventUuid = pathParameters ? pathParameters.event_id : pathParameters;

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

  if (eventUuid && httpMethod === "GET") {
    return await getEvent(eventUuid);
  } else if (httpMethod === "POST") {
    return await createEvent(serviceUuid, userUuid, body);
  } else if (httpMethod === "GET") {
    return await listEvents(userUuid);
  }
};
