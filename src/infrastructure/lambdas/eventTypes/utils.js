const { db } = require("./db");

const VALID_UUID = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;

const newResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify(body),
  };
};

const uuidToId = async (table, uuid) => {
  const text = `SELECT id FROM ${table} WHERE uuid = $1`;
  const values = [uuid];

  try {
    const response = await db.query(text, values);
    const responseBody = response.rows[0];
    return responseBody.id;
  } catch (error) {
    console.log(error);
    return;
  }
};

const isValidService = async (serviceUuid) => {
  if (!VALID_UUID.test(serviceUuid)) {
    return false;
  }

  const text = `SELECT uuid FROM services WHERE uuid = $1`;
  const values = [serviceUuid];
  const response = await db.query(text, values);
  return response.rows.length > 0;
};

const isValidEventTypeName = (name) => {
  const eventTypeNameRegex = /^[a-z0-9-_]{1,50}$/i;
  return eventTypeNameRegex.test(name);
};

module.exports.newResponse = newResponse;
module.exports.isValidService = isValidService;
module.exports.uuidToId = uuidToId;
module.exports.isValidEventTypeName = isValidEventTypeName;
