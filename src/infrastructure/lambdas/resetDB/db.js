const { Pool } = require("pg");

const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;
const database = process.env.DATABASE_NAME;
const port = process.env.DATABASE_PORT;
const pool = new Pool({
  user,
  host,
  database,
  password,
  port,
});

module.exports.db = pool;
