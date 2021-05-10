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
  getEventTypeInfoFromName:
    "SELECT id, sns_topic_arn FROM event_types WHERE name = $1",
  saveEndpointToDb: `INSERT INTO endpoints(user_id, url)
    VALUES($1, $2) RETURNING id, uuid, url, created_at`,
  saveSubscriptionToDb: `INSERT INTO subscriptions(endpoint_id, event_type_id, subscription_arn)
    VALUES($1, $2, $3) RETURNING uuid`,
  listEndpoints: `SELECT endpoints.uuid, url, array_agg(event_types.name) AS event_types, endpoints.created_at
    FROM subscriptions
    JOIN endpoints ON subscriptions.endpoint_id = endpoints.id
    JOIN event_types ON subscriptions.event_type_id = event_types.id
    JOIN users ON endpoints.user_id = users.id
    WHERE users.uuid = $1
    GROUP BY endpoints.id`,
  getEndpoint: `SELECT endpoints.uuid, url, array_agg(event_types.name) AS event_types, endpoints.created_at
    FROM subscriptions
    JOIN endpoints ON subscriptions.endpoint_id = endpoints.id
    JOIN event_types ON subscriptions.event_type_id = event_types.id
    WHERE endpoints.uuid = $1 GROUP BY endpoints.id`,
  getEndpointData: "SELECT * FROM endpoints WHERE uuid = $1",
  deleteEndpoint: "DELETE FROM endpoints WHERE uuid = $1 RETURNING uuid",
  getSubscriptions: `SELECT subscriptions.subscription_arn, event_types.name
    FROM endpoints
    JOIN subscriptions ON endpoints.id = subscriptions.endpoint_id
    JOIN event_types ON subscriptions.event_type_id = event_types.id
    WHERE endpoints.uuid = $1`,
  deleteSubscription: "DELETE FROM subscriptions WHERE subscription_arn = $1",
};

module.exports.db = pool;
module.exports.queries = queries;
