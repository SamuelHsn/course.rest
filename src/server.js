const App = require("./app");

const PlaceData = require("./places/data");
const Places = require("./places/controller");
const places = new Places(new PlaceData());
const Files = require("./files/controller");
const files = new Files();
const Users = require("./users/controller");
const users = new Users();
const app = new App(places, files, users).app;

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});
