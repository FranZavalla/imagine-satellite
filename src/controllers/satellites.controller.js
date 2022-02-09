const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const db = require("../db");
const Satellites = db.models.Satellites;
const SpaceTracks = db.models.SpaceTracks;
const User = db.models.Users;

class SatellitesController {
  static async create(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      let errors = [];
      result.array().forEach((e) => errors.push(e.msg));
      return res.status(400).json({ created: false, msg: errors });
    }

    const key = req.query.key;
    try {
      const decoded = jwt.verify(key, process.env.JWT_SECRET || "secret_salt");
      const user = await User.findOne({ where: { id: decoded.id } });
      if (!user) {
        return res.status(404).json({ created: false, msg: "User not found" });
      }

      const {
        launch,
        version,
        height_km,
        latitude,
        longitude,
        velocity_kms,
        spaceTrack,
      } = req.body;

      const newSatellite = new Satellites({
        id: uuid(),
        launch,
        version,
        height_km,
        latitude,
        longitude,
        velocity_kms,
      });

      spaceTrack.id = uuid();
      spaceTrack.SatelliteId = newSatellite.dataValues.id;
      const newSpaceTrack = new SpaceTracks(spaceTrack);

      await newSatellite.save();
      await newSpaceTrack.save();

      return res
        .status(201)
        .json({ created: true, msg: "Satellite created successfully" });
    } catch (e) {
      return res.status(500).json({
        created: false,
        msg: "There was a problem creating a satellite",
        error: e,
      });
    }
  }

  static async get(req, res) {
    try {
      const satellites = await Satellites.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      const spaceTrack = await SpaceTracks.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "id"] },
      });

      let satelliteData = [];
      satellites.map((sat) => {
        satelliteData.push(sat.dataValues);
      });
      satelliteData.sort();

      let trackData = [];
      spaceTrack.map((track) => {
        trackData.push(track.dataValues);
      });
      trackData.sort();

      let result = [];
      for (let i = 0; i < satelliteData.length; i++) {
        satelliteData[i].spaceTrack = trackData[i];
        result.push(satelliteData[i]);
      }

      res.status(200).send(result);
    } catch (e) {
      return res.status(500).json({
        msg: "There was a problem getting satellites",
        error: e,
      });
    }
  }
}

module.exports = SatellitesController;
