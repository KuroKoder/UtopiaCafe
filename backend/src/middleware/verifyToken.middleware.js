const jwt = require("jsonwebtoken");
const { MY_SECRET_TOKEN } = require("../utils/constant");

// Middleware untuk verifikasi token
exports.verifyToken = (req, res, next) => {
  // Mengambil header authorization
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader);

  // Mengambil token dari header jika ada
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Token Extracted:", token);

  // Jika token tidak ada, kirim status 401 (Unauthorized)
  if (token == null) {
    console.log("Token is missing");
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Verifikasi token menggunakan jwt.verify
  jwt.verify(token, MY_SECRET_TOKEN, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.status(403).json({ error: "Forbidden" });
    }

    // Menyimpan decoded token ke req.email untuk digunakan di middleware berikutnya
    req.email = decoded.email;
    console.log("Token decoded successfully. Email:", req.email);

    // Melanjutkan ke middleware berikutnya
    next();
  });
};
