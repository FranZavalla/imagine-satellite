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

      let satellitesFull = [];
      for (let i = 0; i < satelliteData.length; i++) {
        satelliteData[i].spaceTrack = trackData[i];
        satellitesFull.push(satelliteData[i]);
      }

      res.status(200).send(satellitesFull);
    } catch (e) {
      return res.status(500).json({
        msg: "There was a problem getting satellites",
      });
    }
  }

  static async getByName(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      let errors = [];
      result.array().forEach((e) => errors.push(e.msg));
      return res.status(400).json({ msg: errors });
    }

    const name = req.query.name;
    try {
      const track = await SpaceTracks.findOne({
        where: { OBJECT_NAME: name },
        attributes: { exclude: ["createdAt", "updatedAt", "id"] },
      });

      if (!track) {
        return res.status(400).json({ msg: `Satellite ${name} not found` });
      }

      const SatId = track.dataValues.SatelliteId;

      const satellite = await Satellites.findOne({
        where: { id: SatId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      satellite.dataValues.spaceTrack = track.dataValues;
      res.status(200).json({ satellite });
    } catch (e) {
      res
        .status(500)
        .json({ msg: "There was a problem getting satellite", error: e });
    }
  }

  static async getByDistance(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      let errors = [];
      result.array().forEach((e) => errors.push(e.msg));
      return res.status(400).json({ msg: errors });
    }

    try {
      const { l1, l2, d } = req.query;
      const haversine = require("../utils/haversine");

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

      let satellitesFull = [];
      for (let i = 0; i < satelliteData.length; i++) {
        satelliteData[i].spaceTrack = trackData[i];
        satellitesFull.push(satelliteData[i]);
      }

      const satellitesInDistance = satellitesFull.filter((sat) => {
        let satDist = haversine(l1, sat.latitude, l2, sat.longitude);
        return satDist <= d;
      });

      res.status(200).json({ satellitesInDistance });
    } catch (e) {
      res
        .status(500)
        .json({ msg: "There was a problem getting satellites", error: e });
    }
  }
}

module.exports = SatellitesController;
