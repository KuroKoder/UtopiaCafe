const express = require("express");
const { json, urlencoded } = require("express");
const database = require("./src/configs/database");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoute = require("./src/routes/user.route");
const orderRoute = require("./src/routes/order.route");
const productRoute = require("./src/routes/product.route");
const websocket = require("./websocket");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer");
const { single } = require("./src/utils/multerConfig");
const Users = require("./src/models/user.model");

// Load environment variables
require("dotenv").config();

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 3000;

const allowedOrigins = [
  process.env.FRONT_END_URL || "http://localhost:5173", // Default to localhost:5173 if not set
  process.env.FE_ONLINE || "https://this.utopiacafe.shop", // Default to production URL if not set
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Request origin: ", origin);
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Not allowed by CORS: ", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use("/images", express.static(path.join(__dirname, "images")));
// app.use(multer({ storage: storage, fileFilter: filefilter }).single("images"));
app.use(json());
app.use(urlencoded({ extended: true }));

// Database sync
(async () => {
  try {
    await database.authenticate();
    // await Users.sync({ force: true });
    console.log("Database synced");
  } catch (error) {
    console.error("Failed to sync database: " + error);
  }
})();

// Order Route
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoute);
app.use("/api/products", productRoute);

// Endpoint untuk mengecek status koneksi
app.get("/api/check-connection", async (req, res) => {
  try {
    const isConnected = await websocket.checkEsp32Connection(5000); // 5 seconds timeout
    res.json({ connected: isConnected });
    console.log(isConnected);
  } catch (error) {
    console.error(error);
    res.status(500).json({ connected: false, error: "Internal Server Error" });
    console.log(isConnected);
  }
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server up and running http://localhost:${port}`);
  websocket.init(server).then(() => {
    console.log("WebSocket server initialized");
  });
});
