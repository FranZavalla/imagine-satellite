const { body } = require("express-validator");

const authValidation = {
  register: [
    body("username")
      .isLength({ min: 5, max: 30 })
      .withMessage(
        "Username must have at least 5 characters and a maximum of 30"
      )
      .exists()
      .withMessage("Username is required"),
    body("password")
      .isLength({ min: 7 })
      .withMessage("Password must be 7 chars at least")
      .exists()
      .withMessage("Password is required"),
  ],
  login: [
    body("username").exists().withMessage("Username is required"),
    body("password").exists().withMessage("Password is required"),
  ],
};

module.exports = authValidation;
