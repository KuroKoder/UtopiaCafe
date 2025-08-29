const { Sequelize } = require("sequelize");
const { DB, USER, PASSWORD, HOST, DIALECT } = require("../database.config");
const { noTrueLogging } = require("sequelize/lib/utils/deprecations");
// const { DB, USER, PASSWORD, HOST, DIALECT } = require("../database.config");

const database = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  dialect: DIALECT,
  logging: false,
});

module.exports = database;
