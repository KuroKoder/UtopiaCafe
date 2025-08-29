const midtransClient = require("midtrans-client");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const crypto = require("crypto");
const WebSocket = require("ws");
const {
  CANCELED,
  PENDING_PAYMENT,
  PAID,
  MY_MIDTRANS_SERVER_KEY,
  MY_MIDTRANS_CLIENT_KEY,
} = require("../utils/constant");
const websocket = require("../../websocket");

// Load environment variables
require("dotenv").config();

// Initialize Midtrans client
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: MY_MIDTRANS_SERVER_KEY,
  clientKey: MY_MIDTRANS_CLIENT_KEY,
});

exports.create = async (req, res) => {
  try {
    const { name, detail_order, total_price } = req.body;

    // Create transaction_id using crypto
    const order_id = crypto.randomBytes(16).toString("hex");

    // Calculate total price based on detail_order
    let calculatedTotalPrice = 0;
    const itemDetails = [];

    // Prepare item details based on detail_order
    for (const { id, quantity } of detail_order) {
      const product = await Product.findByPk(id);
      if (product) {
        const itemTotalPrice = product.price * quantity;
        calculatedTotalPrice += itemTotalPrice;

        itemDetails.push({
          id: product.id.toString(),
          price: product.price,
          quantity: quantity,
          name: product.name,
        });
      }
    }

    if (calculatedTotalPrice !== total_price) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Total price does not match the sum of item prices",
        data: null,
        error: "Invalid total price",
      });
    }

    const order = await Order.create({
      order_id,
      name,
      total_order: itemDetails.length,
      detail_order,
      total_price: calculatedTotalPrice,
    });

    console.log(order);

    // Create a Midtrans payment token
    let parameter = {
      payment_type: "qris",
      transaction_details: {
        order_id: order_id,
        gross_amount: total_price,
      },
      customer_details: {
        first_name: name,
      },
      item_details: itemDetails,
    };

    try {
      const transaction = await snap.createTransaction(parameter);
      let transactionToken = transaction.token;

      // Update order with transaction token
      await order.update({
        transaction_token: transactionToken,
      });

      // Return payment token to client
      res.status(201).json({
        status: 201,
        success: true,
        message: "New order created",
        data: order,
        payment_token: transactionToken,
        error: null,
      });
    } catch (e) {
      console.log("Error occurred:", e.message);
      res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: null,
        error: "Internal Server Error",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      data: null,
      error: "Internal Server Error",
    });
  }
};

exports.getTransactions = async (req, res) => {
  const { status } = req.query;
  try {
    let whereClause = {};

    // Jika status diberikan, filter berdasarkan status
    if (status && status !== "All") {
      whereClause.payment_status = status;
    }

    // Ambil transaksi berdasarkan whereClause
    const orders = await Order.findAll({ where: whereClause });

    res.json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      data: null,
      error: "Internal Server Error",
    });
  }
};

exports.getTransactionById = async (req, res) => {
  const { orderId } = req.params; // Menggunakan req.params untuk mendapatkan orderId
  console.log("Fetching transaction with order_id:", orderId); // Logging untuk memeriksa orderId
  try {
    const transaction = await Order.findOne({ where: { order_id: orderId } });
    if (!transaction) {
      return res.status(404).json({
        status: "error",
        message: "Transaction not found",
      });
    }
    res.json({
      status: "success",
      data: transaction,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      data: null,
      error: "Internal Server Error",
    });
  }
};

const sendOrderToESP32 = async (order) => {
  console.log("Ini data order yang mau dikirim: ", order.detail_order);
  const data = JSON.stringify(order.detail_order); // Mengonversi objek menjadi JSON string
  console.log("Ini data order yang mau dikirim after konversi: ", data);

  // Periksa koneksi ESP32
  const esp32Connected = await websocket.checkEsp32Connection();
  if (!esp32Connected) {
    console.log("ESP32 tidak merespons. Silakan coba lagi nanti.");
    return {
      success: false,
      message: "ESP32 tidak merespons. Silakan coba lagi nanti.",
    };
  }

  // Mengirim data ke setiap client WebSocket yang terhubung
  const wss = websocket.getWss();
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data, (err) => {
        if (err) {
          console.error("Error sending data to client:", err);
        } else {
          console.log(`Data sent to client: ${data}`);
        }
      });
    }
  });

  console.log(
    `Order ${order.order_id} dengan detail ${data} dikirim ke ESP32 melalui WebSocket`
  );

  return { success: true, message: "Pesanan berhasil dikirim ke ESP32." };
};

exports.updateTransactionStatus = async ({
  order_id,
  status,
  payment_method,
}) => {
  try {
    const transaction = await Order.findOne({ where: { order_id } });
    if (!transaction) {
      return { success: false, message: "Transaksi tidak ditemukan." };
    }

    const now = new Date();
    const lastUpdate = new Date(transaction.updated_at);
    const delayThreshold = 2 * 60 * 1000; // 1 hour in milliseconds

    if (now - lastUpdate > delayThreshold) {
      console.log(
        `Status update for order_id ${order_id} is too delayed and will not be sent to ESP32.`
      );
      return { success: false, message: "Status update is too delayed." };
    }

    await transaction.update({
      payment_status: status,
      payment_method,
    });

    if (status === "PAID") {
      console.log("Detail transaksi setelah memperbarui status:");
      console.log(transaction); // Log detail transaksi setelah diperbarui
      const result = await sendOrderToESP32(transaction); // Kirim detail pesanan ke ESP32

      if (!result.success) {
        // Kirim pesan ke frontend bahwa pesanan tidak dapat diproses karena ESP32 tidak terhubung
        return { success: false, message: result.message };
      }
    }

    return { success: true, message: "Status transaksi berhasil diperbarui." };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const UpdateStatusBasedOnMidtransResponse = async (order_id, data) => {
  const hash = crypto
    .createHash("sha512")
    .update(
      `${order_id}${data.status_code}${data.gross_amount}${MY_MIDTRANS_SERVER_KEY}`
    )
    .digest("hex");

  if (data.signature_key !== hash) {
    return {
      status: "error",
      message: "Invalid Signature key",
    };
  }

  let responseData = null;
  let transactionStatus = data.transaction_status;
  let fraudStatus = data.fraud_status;

  if (transactionStatus == "capture") {
    if (fraudStatus == "accept") {
      const transaction = await exports.updateTransactionStatus({
        order_id,
        status: PAID,
        payment_method: data.payment_type,
      });
      responseData = transaction;
    }
  } else if (transactionStatus == "settlement") {
    const transaction = await exports.updateTransactionStatus({
      order_id,
      status: PAID,
      payment_method: data.payment_type,
    });
    responseData = transaction;
  } else if (
    transactionStatus == "cancel" ||
    transactionStatus == "deny" ||
    transactionStatus == "expire"
  ) {
    const transaction = await exports.updateTransactionStatus({
      order_id,
      status: CANCELED,
    });
    responseData = transaction;
  } else if (transactionStatus == "pending") {
    const transaction = await exports.updateTransactionStatus({
      order_id,
      status: PENDING_PAYMENT,
    });
    responseData = transaction;
  }

  return {
    status: "success",
    data: responseData,
  };
};

exports.trxNotif = async (req, res) => {
  const data = req.body;
  console.log("Received notification:", data);

  try {
    const transaction = await Order.findOne({
      where: { order_id: data.order_id },
    });
    if (transaction) {
      const result = await UpdateStatusBasedOnMidtransResponse(
        transaction.order_id,
        data
      );
      console.log("Update status result:", result);
    }
    res.status(200).json({
      status: "success",
      message: "OK",
    });
  } catch (error) {
    console.error("Error processing notification:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      data: null,
      error: "Internal Server Error",
    });
  }
};
