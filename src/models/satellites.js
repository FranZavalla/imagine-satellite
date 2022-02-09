module.exports = (sequelize, DataType) => {
  const Satellites = sequelize.define("Satellites", {
    id: {
      type: DataType.STRING,
      primaryKey: true,
    },
    launch: {
      type: DataType.STRING,
      allowNull: true,
    },
    version: {
      type: DataType.STRING,
      allowNull: true,
    },
    height_km: {
      type: DataType.DOUBLE,
      allowNull: true,
      validate: {
        min: 0.0,
      },
    },
    latitude: {
      type: DataType.DOUBLE,
      allowNull: true,
      validate: {
        min: -90.0,
        max: 90.0,
      },
    },
    longitude: {
      type: DataType.DOUBLE,
      allowNull: true,
      validate: {
        min: -180.0,
        max: 180.0,
      },
    },
    velocity_kms: {
      type: DataType.DOUBLE,
      allowNull: true,
      validate: {
        min: 0.0,
        max: 299792.458,
      },
    },
  });

  Satellites.associate = (models) => {
    Satellites.hasOne(models.SpaceTracks);
  };

  return Satellites;
};
