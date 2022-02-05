const Router = require("express");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { v4: uuid } = require("uuid");

const db = require("../db");
const authRoute = Router();
const User = db.models.Users;

// POST /auth/register
// Register a new user and respond with token
authRoute.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username && password) {
      const someUser = await User.findOne({ where: { username: username } });
      if (someUser) {
        return res
          .status(202)
          .json({ auth: false, msg: "Your username already exist" });
      }
      if (username.length < 5 || username.length > 30) {
        return res.status(202).json({
          auth: false,
          msg: "The username must have at least 5 characters and a maximum of 30",
        });
      }
      if (password.length < 7) {
        return res
          .status(202)
          .json({ auth: false, msg: "Password must be 7 chars at least" });
      }

      const hashPassword = await bcryptjs.hash(password, 8);

      const user = new User({
        id: uuid(),
        username: username,
        password: hashPassword,
      });

      const key = jwt.sign(
        { id: user.dataValues.id },
        process.env.JWT_SECRET || "secret_salt"
      );

      await user.save();
      return res.status(201).json({ auth: true, key: key });
    } else {
      return res
        .status(202)
        .json({ auth: false, msg: "Username and password are required" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ auth: false, msg: "There was a problem registering your user" });
  }
});

// POST /auth/login
// Log in your account to get the key
authRoute.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username && password) {
      const user = await User.findOne({ where: { username: username } });
      const correctPassword = await bcryptjs.compare(
        password,
        user.dataValues.password
      );

      if (!user || !correctPassword) {
        return res
          .status(202)
          .json({ auth: false, msg: "Icorrect username or password" });
      }

      const key = jwt.sign(
        { id: user.dataValues.id },
        process.env.JWT_SECRET || "secret_salt"
      );

      return res.status(200).json({ auth: true, key: key });
    } else {
      return res
        .status(202)
        .json({ auth: false, msg: "Missing password or username" });
    }
  } catch (e) {
    return res.status(500).json({ status: "There was a problem logging" });
  }
});

module.exports = authRoute;
