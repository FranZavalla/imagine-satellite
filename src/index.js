const app = require("./libs/middlewares");
const db = require("./db");

let server;

db.sequelize.sync().then(
  (server = app.listen(app.get("port"), () => {
    console.log(`Server on port: ${app.get("port")}`);
  }))
);

module.exports = { server, app };
