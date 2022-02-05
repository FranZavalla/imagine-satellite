let config = {};

if (process.env.NODE_ENV == "test") {
  config = {
    database: "satellite_db",
    username: "",
    password: "",
    params: {
      dialect: "sqlite",
      storage: "satellite_db_test.sqlite",
      operatorAliases: false,
    },
  };
} else {
  config = {
    database: "satellite_db",
    username: "",
    password: "",
    params: {
      dialect: "sqlite",
      storage: "satellite_db.sqlite",
      operatorAliases: false,
    },
  };
}

module.exports = config;
