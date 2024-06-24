const express = require("express");
const bodyParser = require("body-parser");
const packageJson = require("../package.json");

class App {
  constructor(place, files, users) {
    const app = express();

    app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    app.use(
      bodyParser.json({
        type: ["application/json", "application/json-patch+json"],
      })
    );

    var middlewareHttp = function (request, response, next) {
      response.setHeader("Api-version", packageJson.version);

      console.log(`${request.method} ${request.originalUrl}`);
      if (request.body && Object.keys(request.body).length > 0) {
        console.log(`request.body ${JSON.stringify(request.body)}`);
      }
      next();
    };
    app.use(middlewareHttp);

    place.configure(app);
    files.configure(app);
    users.configure(app);

    app.get("/api/version", function (request, response) {
      response.json({
        version: packageJson.version,
      });
    });

    app.use(function (error, request, response, next) {
      if (error.name === "UnauthorizedError") {
        console.log(error);
        response.set("Access-Control-Allow-Origin", "http://localhost:3000");
        response.set(
          "Access-Control-Allow-Headers",
          "content-type, my-header-custom, authorization"
        );
        response.status(401).json({ key: "unauthorized" });
        return;
      }
      next();
    });

    // eslint-disable-next-line no-unused-vars
    app.use(function (error, request, response, next) {
      console.error(error.stack);
      response.status(500).json({
        key: "server.error",
      });
    });
    this.app = app;
  }
}

module.exports = App;
