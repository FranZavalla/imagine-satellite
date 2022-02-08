const Router = require("express");

const authValidation = require("../validations/auth.validation");
const AuthController = require("../controllers/auth.controller");

const route = Router();

// POST /auth/register
// Register a new user and respond with token
route.post("/auth/register", authValidation.register, AuthController.register);

// POST /auth/login
// Log in your account to get the key
route.post("/auth/login", authValidation.login, AuthController.login);

module.exports = route;
