const { body, query } = require("express-validator");

const satellitesValidation = {
  create: [
    query("key")
      .exists()
      .withMessage("No key provided")
      .isJWT()
      .withMessage("Invalid key"),
    body("height_km")
      .isFloat({ min: 0.0 })
      .withMessage("Minimum value for height is 0"),
    body("latitude")
      .isFloat({ min: -90.0, max: 90.0 })
      .withMessage(
        "The minimum and maximum value for latitude is -90.0 and 90.0 respectively"
      ),
    body("longitude")
      .isFloat({ min: -180.0, max: 180.0 })
      .withMessage(
        "The minimum and maximum value for longitude is -180.0 and 180.0 respectively"
      ),
    body("velocity_kms")
      .isFloat({ min: 0.0, max: 299792.458 })
      .withMessage(
        "The minimum and maximum value for velocity is 0.0 and 299792.458 respectively"
      ),
  ],
  getByName: [query("name").exists().withMessage("No name provided")],
};

module.exports = satellitesValidation;
