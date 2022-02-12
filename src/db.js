const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const config = require("./libs/config");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config.params
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.models = {};

const dir = path.join(__dirname, "models");

fs.readdirSync(dir).forEach((filename) => {
  const modelDir = path.join(dir, filename);
  const model = require(modelDir)(sequelize, Sequelize.DataTypes);
  db.models[model.name] = model;
});

Object.keys(db.models).forEach((key) => {
  if (db.models[key].hasOwnProperty("associate")) {
    db.models[key].associate(db.models);
  }
});

module.exports = db;
