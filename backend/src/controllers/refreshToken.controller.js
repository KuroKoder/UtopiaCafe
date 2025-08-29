const Users = require("../models/user.model");
const { My_REF_TOKEN, MY_SECRET_TOKEN } = require("../utils/constant");
const jwt = require("jsonwebtoken");

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("Received refresh token:", refreshToken);

    if (!refreshToken) return res.sendStatus(401);

    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });

    console.log("User found:", user);

    if (!user[0]) return res.sendStatus(403);

    jwt.verify(refreshToken, My_REF_TOKEN, (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(403).send("Invalid token");
      }

      const userId = user[0].id;
      const name = user[0].name;
      const email = user[0].email;
      const accessToken = jwt.sign({ userId, name, email }, MY_SECRET_TOKEN, {
        expiresIn: "15s",
      });

      res.json({ accessToken });
    });
  } catch (error) {
    console.error("Error in refreshToken:", error);
    res.sendStatus(500);
  }
};
