const Users = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MY_SECRET_TOKEN, My_REF_TOKEN } = require("../utils/constant");

exports.getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email"],
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: "ok",
      data: users, // This should be an array
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "internal server error",
      data: null,
      error: "Internal Server Error",
    });
  }
};

exports.Register = async (req, res) => {
  try {
    const { name, email, password, confPassword } = req.body;

    // Cek apakah password dan konfirmasi password sesuai
    if (password !== confPassword)
      return res
        .status(400)
        .json({ msg: "Password dan confirm password tidak sesuai" });

    // Cek apakah email sudah ada
    const existingUser = await Users.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({ msg: "Email sudah digunakan" });
    }

    // Proses hashing password dan membuat user baru
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await Users.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    res.json({ msg: "User berhasil dibuat" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan saat membuat user" });
  }
};

exports.Login = async (req, res) => {
  try {
    // Mengambil pengguna berdasarkan email
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });

    // Mengecek jika pengguna ditemukan
    if (!user) {
      return res.status(404).json({ msg: "Email tidak ditemukan" });
    }

    // Membandingkan password
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Email dan Password tidak cocok" });
    }

    // Membuat token
    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const accessToken = jwt.sign({ userId, name, email }, MY_SECRET_TOKEN, {
      expiresIn: "20s",
    });
    const refreshToken = jwt.sign({ userId, name, email }, My_REF_TOKEN, {
      expiresIn: "1d",
    });

    // Mengupdate refresh token di database
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: { id: userId },
      }
    );

    // Mengirimkan cookie dengan refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Cookie tidak dapat diakses oleh JavaScript
      secure: true, // Hanya dikirim melalui HTTPS
      sameSite: "None", // Harus "None" jika menggunakan `secure: true` dan tunneling
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    // Mengirimkan access token sebagai respons
    res.json({ accessToken });
    console.log(accessToken);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

exports.Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(204).json({
      message: "No refresh token found, already logged out or session expired.",
    });
  }

  const user = await Users.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!user) {
    return res.status(204).json({
      message: "No matching user found, possibly already logged out.",
    });
  }

  const userId = user.id;

  await Users.update(
    { refreshToken: null },
    {
      where: { id: userId },
    }
  );

  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logout successful." });
};

// Endpoint untuk memeriksa autentikasi
exports.authenticate = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Not authenticated" });
    }

    // Verifikasi token
    jwt.verify(refreshToken, My_REF_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json({ msg: "Token is not valid" });
      }

      // Mengirimkan response yang menandakan autentikasi berhasil
      res.status(200).json({ authenticated: true, user: user });
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
