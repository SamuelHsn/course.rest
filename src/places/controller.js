const { request } = require("express");
const { validate } = require("jsonschema");
var { expressjwt: jwt } = require("express-jwt");
var placeSchema = {
  id: "/Place",
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 100,
      pattern: "^[a-zA-Z-]*$",
    },
    author: {
      type: "string",
      minLength: 3,
      maxLength: 100,
      pattern: "^[a-zA-Z-]*$",
    },
    review: { type: "integer", minimum: 1, maximum: 9 },
    image: {
      type: "object",
      properties: {
        url: { type: "string", pattern: "(http|https):?://.*" },
        title: { type: "string", minLenght: 3, maxLenght: 100 },
      },
      required: ["url", "title"],
    },
  },

  required: ["author", "review", "name"],
};

class Places {
  constructor(data) {
    this.data = data;
  }
  configure(app) {
    const data = this.data;

    app.get("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      const place = await data.getPlaceAsync(id);
      if (place !== undefined) {
        response.status(200).json(place);
        return;
      }
      response.status(404).json({ key: "entity.not.found" });
    });

    app.post(
      "/api/places",
      jwt({ secret: "my secret key", algorithms: ["HS256"] }),
      (request, response) => {
        response.set("Access-Control-Allow-Origin", "http://localhost:3000");
        response.set(
          "Access-Control-Allow-Headers",
          "content-type, my-header-custom, authorization"
        );
        //if (!req.auth.admin) return res.sendStatus(401);

        //response.set("Access-Control-Allow-Headers", "my-header-custom");
        let place = request.body;
        const result = validate(place, placeSchema);
        console.log(result);
        if (!result.valid) {
          response
            .status(400)
            .json({ key: "entity.validation.error", errors: result.errors });
          return;
        }
        data.addPlace(place);
        response.status(201).json(place);
      }
    );

    app.get("/api/places", async (request, response) => {
      let id = request.params.id;
      const places = await data.getPlacesAsync(id);
      response.set("Access-Control-Allow-Origin", "http://localhost:3000");
      response.set("Cache-Control", "public, private, max-age=15");
      if (places !== undefined) {
        response.status(200).json({ places: places });
        return;
      }

      response.status(404).json({ key: "entity.not.found" });
    });

    app.options("/api/places", async (request, response) => {
      response.set("Access-Control-Allow-Origin", "http://localhost:3000");
      //response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      response.set(
        "Access-Control-Allow-Headers",
        "content-type, my-header-custom, authorization"
      );
      response.status(200).json({});
    });
  }
}
module.exports = Places;
