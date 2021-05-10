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
  createEventType:
    "INSERT INTO event_types(name, service_id, sns_topic_arn) VALUES($1, $2, $3) RETURNING uuid, name, sns_topic_arn, created_at",
  listEventTypes: `SELECT event_types.uuid, event_types.name, event_types.created_at
    FROM event_types
    JOIN services ON event_types.service_id = services.id
    WHERE services.uuid = $1 AND event_types.deleted_at IS NULL`,
  getEventType:
    "SELECT uuid, name, sns_topic_arn, created_at FROM event_types WHERE uuid = $1 AND deleted_at IS NULL",
  deleteEventType:
    "UPDATE event_types SET deleted_at = NOW() WHERE uuid = $1 AND deleted_at IS NULL RETURNING sns_topic_arn",
};

module.exports.db = pool;
module.exports.queries = queries;
