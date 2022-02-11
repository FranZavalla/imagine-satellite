const Router = require("express");

const satellitesValidation = require("../validations/satellites.validation");
const spaceTrackValidation = require("../validations/spaceTrack.validation");
const SatellitesController = require("../controllers/satellites.controller");

const router = Router();

// POST /saletellites?key
// Create a new satellite. Key is needed
router.post(
  "/satellite",
  [satellitesValidation.create, spaceTrackValidation.create],
  SatellitesController.create
);

// GET /satellite
// Get all satellites from database
router.get("/satellite", SatellitesController.get);

// GET /satelliteByName?name
// Get a satellite by name
router.get(
  "/satelliteByName",
  satellitesValidation.getByName,
  SatellitesController.getByName
);

router.get(
  "/satelliteByDistance",
  satellitesValidation.getByDistance,
  SatellitesController.getByDistance
);

module.exports = router;
