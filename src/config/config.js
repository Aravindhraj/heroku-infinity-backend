const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  development: {
    username: process.env.NODE_DB_USER,
    password: process.env.NODE_DB_PASSWORD,
    database: process.env.NODE_DB_DATABASE,
    host: process.env.NODE_DB_HOST,
    port: process.env.NODE_DB_PORT,
    port: 3306,
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true,
    },
    seederStorage: "json",
  },
  production: {
    username: process.env.NODE_DB_USER,
    password: process.env.NODE_DB_PASSWORD,
    database: process.env.NODE_DB_DATABASE,
    host: process.env.NODE_DB_HOST,
    port: process.env.NODE_DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true,
    },
    seederStorage: "json",
  },
};
