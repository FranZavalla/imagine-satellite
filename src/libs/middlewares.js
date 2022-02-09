const express = require("express");
const cors = require("cors");
const app = require("./app");

// app settings
app.set("port", process.env.PORT || 3000);
app.set("json spaces", 2);

// app middlewares
app.use(express.json());
app.use(cors());

//app routes
app.use(require("../routes/auth"));
app.use(require("../routes/satellites"));

module.exports = app;
