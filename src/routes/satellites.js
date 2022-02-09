const Router = require("express");

const satellitesValidation = require("../validations/satellites.validation");
const spaceTrackValidation = require("../validations/spaceTrack.validation");
const SatellitesController = require("../controllers/satellites.controller");

const router = Router();

// POST /saletellites
// Create a new satellite. Key is needed
router.post(
  "/satellite",
  [satellitesValidation.create, spaceTrackValidation.create],
  SatellitesController.create
);

// GET /satellites
// Get all satellites from database
router.get("/satellite", SatellitesController.get);

module.exports = router;
