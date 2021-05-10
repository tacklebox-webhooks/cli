"use strict";
const { getUser, createUser, listUsers } = require("./userActions");
const { newResponse, isValidService } = require("./utils");

exports.handler = async (event) => {
  let { pathParameters, httpMethod, body } = event;
  body = JSON.parse(body);
  const userUuid = pathParameters ? pathParameters.user_id : pathParameters;

  const serviceUuid = pathParameters
    ? pathParameters.service_id
    : pathParameters;
  if (!(await isValidService(serviceUuid))) {
    return newResponse(404, {
      error_Type: "data_not_found",
      detail: "No service matches given uuid.",
    });
  }

  if (userUuid) {
    switch (httpMethod) {
      // case "DELETE":
      //   return await deleteUser(userId);
      case "GET":
        return await getUser(userUuid);
    }
  } else {
    switch (httpMethod) {
      case "POST":
        return await createUser(body.name, serviceUuid);
      case "GET":
        return await listUsers(serviceUuid);
    }
  }
};
