"use strict";
const {
  listEndpoints,
  createEndpoint,
  // deleteEndpoint,
  getEndpoint,
  updateEndpoint,
} = require("./endpointActions");
const { newResponse, isValidService, isValidUser } = require("./utils");

exports.handler = async (event) => {
  let { pathParameters, httpMethod, body } = event;
  body = JSON.parse(body);

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

  const endpointUuid = pathParameters
    ? pathParameters.subscription_id
    : pathParameters;

  if (endpointUuid) {
    switch (httpMethod) {
      // case "DELETE":
      //   return await deleteEndpoint(endpointId);
      case "GET":
        return await getEndpoint(endpointUuid);
      case "PUT":
        return await updateEndpoint(endpointUuid, userUuid, body.event_types);
    }
  } else {
    switch (httpMethod) {
      case "POST":
        return await createEndpoint(userUuid, body.url, body.eventTypes);
      case "GET":
        return await listEndpoints(userUuid);
    }
  }
};

// Create New Endpoint
// Input: ServiceId, UserId, url, array of event types
// {url: https://myEndpoint.com, eventTypes: [todo_created, todo_updated]}
// eventTypes: [event_type_uuid, event_type_uuid]

// 1. Create endpoint in DB (url, userId)
// 2. Iterate through eventTypes array
// For each eventType, map uuid to id
// Contact SNS to subscribe endpoint URL to the associated topic
// Take returned subscription ARN, save to DB
