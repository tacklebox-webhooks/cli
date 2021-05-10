const { Pool } = require("pg");

const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;
const database = process.env.DATABASE_NAME;
const port = 5432;
const pool = new Pool({
  user,
  host,
  database,
  password,
  port,
});

const queries = {
  getMessageToResend: `SELECT messages.endpoint, events.payload
    FROM messages
    JOIN events ON messages.event_id = events.id
    WHERE messages.uuid = $1`,
  getResendArn:
    "SELECT sns_topic_arn FROM event_types WHERE name = 'manual_message'",
  getMessage: `SELECT uuid, endpoint, delivery_attempt, status_code, created_at, delivered
  FROM messages WHERE uuid = $1`,
  listMessages: `SELECT messages.uuid, events.uuid AS event_id, messages.endpoint, delivery_attempt, status_code, messages.created_at, delivered
  FROM messages
  JOIN events ON messages.event_id = events.id
  JOIN users ON events.user_id = users.id
  WHERE users.uuid = $1
  ORDER BY messages.created_at DESC`,
};

module.exports.db = pool;
module.exports.queries = queries;
