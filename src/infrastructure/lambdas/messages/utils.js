const { db } = require("./db");

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
  const text = `SELECT uuid FROM services WHERE uuid = $1`;
  const values = [serviceUuid];
  const response = await db.query(text, values);
  return response.rows.length > 0;
};

const isValidUser = async (userUuid) => {
  const text = `SELECT uuid FROM users WHERE uuid = $1`;
  const values = [userUuid];
  const response = await db.query(text, values);
  return response.rows.length > 0;
};

module.exports.newResponse = newResponse;
module.exports.isValidService = isValidService;
module.exports.isValidUser = isValidUser;
module.exports.uuidToId = uuidToId;
