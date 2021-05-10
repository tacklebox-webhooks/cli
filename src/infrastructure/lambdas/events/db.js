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
  getEvent: `SELECT events.uuid, event_types.uuid as event_type_id, event_types.name as event_type_name, users.uuid as user_id, payload, idempotency_key
    FROM events 
    JOIN event_types ON events.event_type_id = event_types.id
    JOIN users ON events.user_id = users.id
    WHERE events.uuid = $1`,
  hasUniqueIdempotencyKey: `SELECT uuid FROM events WHERE idempotency_key = $1`,
  getTopicArn: `SELECT sns_topic_arn FROM event_types WHERE service_id = $1 AND name = $2`,
  addEvent: `INSERT INTO events (uuid, event_type_id, user_id, payload, idempotency_key)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
  listEvents: `SELECT events.uuid, event_types.uuid as event_type_id, event_types.name as event_type_name, users.uuid as user_id, payload, idempotency_key
      FROM events 
      JOIN event_types ON events.event_type_id = event_types.id
      JOIN users ON events.user_id = users.id
      WHERE users.uuid = $1`,
};

module.exports.db = pool;
module.exports.queries = queries;
