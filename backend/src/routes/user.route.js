const express = require("express");
const router = express.Router();
const {
  getUsers,
  Register,
  Login,
  Logout,
  authenticate,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/verifyToken.middleware");
const { refreshToken } = require("../controllers/refreshToken.controller");

// Definisikan rute dengan fungsi callback yang benar
router.post("/", verifyToken, Register);
router.post("/login", Login);
router.get("/", verifyToken, getUsers);
// router.get("/", getUsers);
router.get("/token", refreshToken);
router.delete("/logout", Logout);
router.get("/authenticate", authenticate);

module.exports = router;
