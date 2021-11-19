// Update with your config settings.
const path = require('path');

const DB_PATH = path.resolve(__dirname, './database.sqlite');
const MIGRATIONS_PATH = path.resolve(__dirname, './migrations');
const SEEDS_PATH = path.resolve(__dirname, './seeds');

const DUMMY_DB_PATH = path.resolve(__dirname, './dummy/dummyDB.sqlite');
const DUMMY_MIGRATIONS_PATH = path.resolve(__dirname, './dummy/migrations');
const DUMMY_SEEDS_PATH = path.resolve(__dirname, './dummy/seeds');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: DB_PATH,
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
    },
    migrations: {
      directory: MIGRATIONS_PATH,
    },
    seeds: {
      directory: SEEDS_PATH,
    },
  },
  dummy: {
    client: 'sqlite3',
    connection: {
      filename: DUMMY_DB_PATH,
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
    },
    migrations: {
      directory: DUMMY_MIGRATIONS_PATH,
    },
    seeds: {
      directory: DUMMY_SEEDS_PATH,
    },
  },
};
