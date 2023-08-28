require('dotenv').config();

const {
  NODE_ENV, JWT_SECRET, DB_HOST, PORT,
} = process.env;

const DEV_SECRET = 'secret-key-secret';
const DEV_DB_HOST = 'mongodb://127.0.0.1:27017/bitfilmsdb';
const DEV_PORT = 4000;

const DB_URL = NODE_ENV === 'production' && DB_HOST
  ? DB_HOST : DEV_DB_HOST;

const SERVER_PORT = NODE_ENV === 'production'
  && PORT ? PORT : DEV_PORT;

const SECRET_KEY = NODE_ENV === 'production'
  && JWT_SECRET ? JWT_SECRET : DEV_SECRET;

module.exports = {
  DB_URL,
  SERVER_PORT,
  SECRET_KEY,
};
