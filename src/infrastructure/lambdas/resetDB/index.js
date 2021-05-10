const { db } = require("./db");
const fs = require("fs");
const IS_DRY_RUN = false;

const newResponse = (statusCode, body) => {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
};

const handler = async (event, context) => {
  if (IS_DRY_RUN) {
    const message =
      "Change IS_DRY_RUN to false if you actually want to reset the database.";
    return message;
  }

  const schemaString = fs.readFileSync("./db.sql", "utf8");

  try {
    const response = await db.query(schemaString);
    console.log(response.rows);
    return newResponse(200, response.rows);
  } catch (error) {
    console.error(error);
  }
};

exports.handler = handler;
