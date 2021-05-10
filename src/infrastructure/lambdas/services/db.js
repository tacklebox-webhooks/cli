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
  createService:
    "INSERT INTO services(name) VALUES($1) RETURNING uuid, name, created_at",
  listServices:
    "SELECT uuid, name, created_at FROM services WHERE deleted_at IS NULL",
  getService:
    "SELECT uuid, name, created_at FROM services WHERE uuid = $1 AND deleted_at IS NULL",
  deleteService:
    "UPDATE services SET deleted_at = NOW() WHERE uuid = $1 AND deleted_at IS NULL RETURNING uuid",
};

module.exports.db = pool;
module.exports.queries = queries;
