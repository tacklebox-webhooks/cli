"use strict";
const zlib = require("zlib");
const { db } = require("./db");

const uuidToPK = async (uuid, table) => {
  const text = `SELECT id FROM ${table} WHERE uuid = $1`;
  const values = [uuid];

  const response = await db.query(text, values);
  console.log(response.rows);
  let responseBody = response.rows[0];
  return responseBody.id;
};

exports.handler = async (event) => {
  const payload = await Buffer.from(event.awslogs.data, "base64");
  const parsed = JSON.parse(zlib.gunzipSync(payload).toString("utf8"));

  for (let i = 0; i < parsed.logEvents.length; i += 1) {
    const createdAt = new Date(parsed.logEvents[i].timestamp).toISOString();
    const message = JSON.parse(parsed.logEvents[i].message);
    console.log(message);

    console.log("EventId: " + message.notification.messageId);
    let eventIdPk;

    try {
      eventIdPk = await uuidToPK(message.notification.messageId, "events");
    } catch (error) {
      console.error(error);
      continue;
    }

    const endpoint = message.delivery.destination;
    const deliveryAttempt = message.delivery.attempts;
    const statusCode = message.delivery.statusCode;
    const uuid = message.delivery.deliveryId;
    const delivered = message.status === "SUCCESS" ? true : false;

    const text =
      "INSERT INTO messages(event_id, uuid, endpoint, status_code, delivery_attempt, created_at, delivered) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING uuid";
    const values = [
      eventIdPk,
      uuid,
      endpoint,
      statusCode,
      deliveryAttempt,
      createdAt,
      delivered,
    ];

    try {
      const response = await db.query(text, values);
      let responseBody = response.rows[0];
      console.log("Created new message in DB with uuid: " + responseBody.uuid);
    } catch (error) {
      console.error(error);
    }
  }
};
