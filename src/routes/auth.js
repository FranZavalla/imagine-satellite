const Router = require("express");
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authValidation = require("../validations/auth.validation");
const db = require("../db");
const route = Router();
const User = db.models.Users;

// POST /auth/register
// Register a new user and respond with token
route.post("/auth/register", authValidation.register, async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    let errors = [];
    result.array().forEach((e) => errors.push(e.msg));
    res.status(400).json({ auth: false, msg: errors });
    return;
  }

  try {
    const { username, password } = req.body;

    const someUser = await User.findOne({ where: { username: username } });
    if (someUser) {
      return res
        .status(400)
        .json({ auth: false, msg: "Your username already exist" });
    }

    const hashPassword = await bcryptjs.hash(password, 8);

    const newUser = new User({
      id: uuid(),
      username: username,
      password: hashPassword,
    });

    const key = jwt.sign(
      { id: newUser.dataValues.id },
      process.env.JWT_SECRET || "secret_salt"
    );

    await newUser.save();

    return res.status(201).json({ auth: true, key });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      auth: false,
      msg: "There was a problem registering your user",
    });
  }
});

// POST /auth/login
// Log in your account to get the key
route.post("/auth/login", authValidation.login, async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    let errors = [];
    result.array().forEach((e) => errors.push(e.msg));
    res.status(400).json({ auth: false, msg: errors });
    return;
  }

  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username: username } });
    const correctPassword = await bcryptjs.compare(
      password,
      user.dataValues.password
    );

    if (!user || !correctPassword) {
      return res
        .status(400)
        .json({ auth: false, msg: "Incorrect username or password" });
    }

    const key = jwt.sign(
      { id: user.dataValues.id },
      process.env.JWT_SECRET || "secret_salt"
    );

    return res.status(200).json({ auth: true, key: key });
  } catch (e) {
    return res.status(500).json({ status: "There was a problem logging" });
  }
});

module.exports = route;
