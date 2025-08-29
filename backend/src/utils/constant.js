// Load environment variables
const dotenv = require("dotenv");
require("dotenv").config();

const PENDING_PAYMENT = "PENDING_PAYMENT";
const PAID = "PAID";
const CANCELED = "CANCELED";
const MY_MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MY_MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_APP_URL = process.env.MIDTRANS_APP_URL;
const FRONT_END_URL = process.env.FRONT_END_URL;
const MY_FE_ONLINE = process.env.FE_ONLINE;
const MY_BE_ONLINE = process.env.BE_ONLINE;
const MY_SECRET_TOKEN = process.env.ACCESS_TOKEN_SECRET;
const My_REF_TOKEN = process.env.REFRESH_TOKEN_SECRET;
module.exports = {
  MY_SECRET_TOKEN,
  My_REF_TOKEN,
  PENDING_PAYMENT,
  PAID,
  CANCELED,
  MY_MIDTRANS_SERVER_KEY,
  MY_MIDTRANS_CLIENT_KEY,
  MIDTRANS_APP_URL,
  FRONT_END_URL,
  MY_FE_ONLINE,
  MY_BE_ONLINE,
};
