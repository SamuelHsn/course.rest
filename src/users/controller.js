const jwt = require("jsonwebtoken");

class Users {
  constructor(data) {
    this.data = data;
  }
  configure(app) {
    const data = this.data;

    app.post("/api/users/login", (request, response) => {
      response.set("Access-Control-Allow-Origin", "http://localhost:3000");
      //response.set("Access-Control-Allow-Headers", "my-header-custom");
      console.log();
      if (
        request.body.username === "gaston" &&
        request.body.password === "password"
      ) {
        response
          .status(200)
          .json({ jwt: jwt.sign({ user: "gaston" }, "my secret key") });
        return;
      }

      response.status(400).json({ error: "Bad credentials" });
    });

    app.options("/api/users/login", async (request, response) => {
      response.set("Access-Control-Allow-Origin", "http://localhost:3000");
      //response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      response.set("Access-Control-Allow-Headers", "Content-Type");
      response.status(200).json({});
    });
  }
}
module.exports = Users;
