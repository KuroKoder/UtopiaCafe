const express = require("express");
const router = express.Router();

const {
  create,
  getTransactions,
  getTransactionById,
  updateTransactionStatus,
  trxNotif,
} = require("../controllers/order.controller");
const { createOrderValidation } = require("../middleware/orderval.middleware");

router.post("/", createOrderValidation, create);
router.get("/", getTransactions);
router.get("/:orderId", getTransactionById);
router.put("/:order_id", updateTransactionStatus);
router.post("/notification", trxNotif);

module.exports = router;
