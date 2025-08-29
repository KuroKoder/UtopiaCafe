// Define Order model
const { DataTypes } = require("sequelize");
const { randomBytes } = require("crypto");
const database = require("../configs/database");
const { PENDING_PAYMENT } = require("../utils/constant");

const Order = database.define("Order", {
  order_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  detail_order: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  total_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transaction_token: {
    type: DataTypes.STRING,
  },
  payment_method: {
    type: DataTypes.STRING,
  },
  payment_status: {
    type: DataTypes.STRING,
    defaultValue: PENDING_PAYMENT, // set default payment status to 'pending'
  },
});

module.exports = Order;
