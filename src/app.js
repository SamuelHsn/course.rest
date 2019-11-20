const express = require("express");
const bodyParser = require("body-parser");
const Places = require("./places/controller");
const Comments = require("./comments/controller");
const Graphql = require("./graphql");
const GraphqlPlaces = require("./places/graphql");
const Users = require("./users/controller");
const Data = require("./data");
const Files = require("./files/controller");
const packageJson = require("../package.json");
const chalk = require("chalk");
const log = console.log;
var serverUtil = require("./serverUtil");

class App {
  constructor() {
    const app = express();

    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    app.use(bodyParser.json());

    var middlewareHttpRequest = function(request, response, next) {
      if (request.url.includes("favicon.ico")) {
        next();
        return;
      }

      response.setHeader("Accept", "application/json");
      response.setHeader("Api-version", packageJson.version);
      log(
        chalk.white.bgBlack(
          "----------------------------------------------------- "
        )
      );
      log(chalk.bold("request.url :") + chalk(new Date()));
      log(chalk.black.bgYellow.underline(`${request.method} ${request.url}`));
      log(chalk.bold("request.headers :"));
      log(chalk.green(`${JSON.stringify(request.headers, null, 2)}`));
      if (request.body && Object.keys(request.body).length > 0) {
        log(chalk.bold("request.body :"));
        log(chalk.green(`${JSON.stringify(request.body, null, 2)}`));
      }

      response.on("finish", () => {
        log(chalk.bold("response.headers :"));
        log(chalk.blue(`${JSON.stringify(response.getHeaders(), null, 2)}`));
      });

      next();
    };
    app.use(middlewareHttpRequest);

    new Files(app);
    var placeData = new Data(require("./places/data.json"));
    new Places(app, placeData);
    new Users(app, new Data(require("./users/data.json")));
    new Comments(app, new Data(require("./comments/data.json")));

    new Graphql(app);

    app.get("/api", function(request, response) {
      const baseUrl = serverUtil.getBaseUrl(request);
      const index = {
        description: "Place api is the place to be!",
        places: `${baseUrl}/api/places`,
        commments: `${baseUrl}/api/comments`,
        users: `${baseUrl}/api/users`,
        files: `${baseUrl}/api/files`
      };
      response.json(index);
    });

    app.get("/api/jsonld", function(request, response) {
      const jsonLd = {
        id: "1",
        name: "Londre",
        review: 2,
        image: {
          link: null
        },
        author: {
          id: "1",
          link: "http://course-rest.azurewebsites.net/api/user/1"
        },
        commments: {
          link:
            "http://course-rest.azurewebsites.net/api/comments?reference.id=1&reference.type=place"
        }
      };
      response.json(jsonLd);
    });

    app.get("/api/version", function(request, response) {
      response.json({
        version: packageJson.version
      });
    });

    var middleware404 = function(request, response) {
      response.json({
        key: "not.found"
      });
    };
    app.use(middleware404);

    // eslint-disable-next-line no-unused-vars
    app.use(function(error, request, response, next) {
      console.error(error.stack);
      response.status(500).json({
        key: "server.error"
      });
    });

    this.app = app;
  }
}

module.exports = App;
