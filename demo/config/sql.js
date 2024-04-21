const path = require("path");

module.exports = {
  development: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: path.join(__dirname, "..", "db", "dev.sqlite3"),
    },
    migrations: {
      directory: path.join(__dirname, "..", "db", "dev", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "..", "db", "dev", "seeds"),
    },
  },
  test: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: path.join(__dirname, "..", "db", "dev.sqlite3"),
    },
    migrations: {
      directory: path.join(__dirname, "..", "db", "dev", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "..", "db", "dev", "seeds"),
    },
  },
  staging: {
    client: "postgresql",
    connection: {
      host: "127.0.0.1",
      user: "postgres",
      password: "postgres",
      database: "postgres",
    },
    migrations: {
      directory: path.join(__dirname, "..", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "..", "db", "prod", "seeds"),
    },
  },
  // production: {},
  // test: {}
};
