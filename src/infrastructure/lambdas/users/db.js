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
  createUser:
    "INSERT INTO users(name, service_id) VALUES($1, $2) RETURNING uuid, name, created_at",
  listUsers: `SELECT users.uuid, users.name, users.created_at
    FROM users
    JOIN services ON users.service_id = services.id
    WHERE services.uuid = $1 AND users.deleted_at IS NULL`,
  getUser:
    "SELECT uuid, name, created_at FROM users WHERE uuid = $1 AND deleted_at IS NULL",
  // deleteUser: "UPDATE users SET deleted_at = NOW() WHERE uuid = $1 AND deleted_at IS NULL RETURNING uuid",
};

module.exports.db = pool;
module.exports.queries = queries;
