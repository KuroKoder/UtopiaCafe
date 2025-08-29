// Define User model
const { DataTypes } = require("sequelize");
const database = require("../configs/database");

const Users = database.define("Users", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true, // Ensures the value is in email format
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.TEXT,
  },
});

module.exports = Users;
