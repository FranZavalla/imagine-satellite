module.exports = (sequelize, DataType) => {
  const SpaceTracks = sequelize.define("SpaceTracks", {
    id: {
      type: DataType.STRING,
      primaryKey: true,
    },
    CCSDS_OMM_VERS: {
      type: DataType.STRING(3),
      allowNull: false,
    },
    COMMENT: {
      type: DataType.STRING(33),
      allowNull: false,
    },
    CREATION_DATE: {
      type: DataType.STRING(19),
      allowNull: false,
    },
    ORIGINATOR: {
      type: DataType.STRING(7),
      allowNull: false,
    },
    OBJECT_NAME: {
      type: DataType.STRING(25),
      allowNull: false,
    },
    OBJECT_ID: {
      type: DataType.STRING(12),
      allowNull: true,
    },
    CENTER_NAME: {
      type: DataType.STRING(5),
      allowNull: false,
    },
    REF_FRAME: {
      type: DataType.STRING(4),
      allowNull: false,
    },
    TIME_SYSTEM: {
      type: DataType.STRING(3),
      allowNull: false,
    },
    MEAN_ELEMENT_THEORY: {
      type: DataType.STRING(4),
      allowNull: false,
    },
    EPOCH: {
      type: DataType.STRING(26),
      allowNull: true,
    },
    MEAN_MOTION: {
      type: DataType.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    ECCENTRICITY: {
      type: DataType.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    INCLINATION: {
      type: DataType.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    RA_OF_ASC_NODE: {
      type: DataType.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    ARG_OF_PERICENTER: {
      type: DataType.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    MEAN_ANOMALY: {
      type: DataType.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    EPHEMRIS_TYPE: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    CLASSIFICATION_TYPE: {
      type: DataType.STRING(1),
      allowNull: false,
    },
    NORAD_CAT_ID: {
      type: DataType.INTEGER,
      allowNull: true,
    },
    ELEMENT_SET_NO: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    REV_AT_EPOCH: {
      type: DataType.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    BSTAR: {
      type: DataType.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    MEAN_MOTION_DOT: {
      type: DataType.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    MEAN_MOTION_DDOT: {
      type: DataType.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    SEMIMAJOR_AXIS: {
      type: DataType.DOUBLE(20, 3),
      allowNull: false,
      defaultValue: 0.0,
    },
    PERIOD: {
      type: DataType.DOUBLE(20, 3),
      allowNull: true,
    },
    APOAPSIS: {
      type: DataType.DOUBLE(20, 3),
      allowNull: false,
      defaultValue: 0.0,
    },
    PERIAPSIS: {
      type: DataType.DOUBLE(20, 3),
      allowNull: false,
      defaultValue: 0.0,
    },
    OBJECT_TYPE: {
      type: DataType.STRING(12),
      allowNull: true,
    },
    RCS_SIZE: {
      type: DataType.STRING,
      allowNull: true,
    },
    COUNTRY_CODE: {
      type: DataType.STRING(2),
      allowNull: true,
    },
    LAUCH_DATE: {
      type: DataType.STRING(10),
      allowNull: true,
    },
    SITE: {
      type: DataType.STRING,
      allowNull: true,
    },
    DECAY_DATE: {
      type: DataType.STRING(10),
      allowNull: true,
    },
    DECAYED: {
      type: DataType.DECIMAL(3, 0),
      allowNull: false,
      defaultValue: 0,
    },
    FILE: {
      type: DataType.INTEGER,
      allowNull: true,
    },
    GP_ID: {
      type: DataType.INTEGER,
      allowNull: true,
    },
    TLE_LINE0: {
      type: DataType.STRING(27),
      allowNull: true,
    },
    TLE_LINE1: {
      type: DataType.STRING(71),
      allowNull: true,
    },
    TLE_LINE2: {
      type: DataType.STRING(71),
      allowNull: true,
    },
  });

  SpaceTracks.associate = (models) => {
    SpaceTracks.belongsTo(models.Satellites);
  };

  return SpaceTracks;
};
