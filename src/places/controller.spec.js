const request = require("supertest");
const App = require("../app");
const PlaceData = require("./data");
const Place = require("./controller");

describe("Places/controller", () => {
  it("GET /api/places/2 should respond a http 200 OK", () => {
    const app = new App(
      new Place(new PlaceData()),
      { configure: jest.fn() },
      { configure: jest.fn() }
    ).app;
    return request(app)
      .get("/api/places/2")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.author).toBe("Louis");
      });
  });

  it("GET /api/places/youhou should respond a http 404", () => {
    const app = new App(
      new Place(new PlaceData()),
      { configure: jest.fn() },
      { configure: jest.fn() }
    ).app;
    return request(app)
      .get("/api/places/youhou")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect((response) => {
        expect(response.body.key).toBe("entity.not.found");
      });
  });

  describe("PATCH /api/places/:id", () => {
    it("should return 404 if place not found", () => {
      const placeService = new Place(new PlaceData());
      const app = new App(
        placeService,
        { configure: jest.fn() },
        { configure: jest.fn() }
      ).app;
      return request(app)
        .patch("/api/places/848455")
        .set("Content-Type", "application/json-patch+json")
        .send([
          { op: "replace", path: "/name", value: "New York" },
          { op: "replace", path: "/author", value: "John" },
        ])
        .expect(404)
        .expect("Content-Type", /json/);
    });

    it("should return 400 if place does not follow schema", () => {
      const placeService = new Place(new PlaceData());
      const app = new App(
        placeService,
        { configure: jest.fn() },
        { configure: jest.fn() }
      ).app;
      return request(app)
        .patch("/api/places/2")
        .set("Content-Type", "application/json-patch+json")
        .send([
          { op: "replace", path: "/name", value: "New York545" },
          { op: "replace", path: "/author", value: "John" },
        ])
        .expect(400)
        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body.key).toBe("entity.validation.error");
        });
    });

    it("should set name and author from json patch body", () => {
      const placeService = new Place(new PlaceData());
      const app = new App(
        placeService,
        { configure: jest.fn() },
        { configure: jest.fn() }
      ).app;
      return request(app)
        .patch("/api/places/2")
        .set("Content-Type", "application/json-patch+json")
        .send([
          { op: "replace", path: "/name", value: "New York" },
          { op: "replace", path: "/author", value: "John" },
        ])
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body.name).toBe("New York");
          expect(response.body.author).toBe("John");
        });
    });
  });

  //TODO Ajouter ici le test qui vérifie le nombre de place remonté par l'api

  /*it('POST /api/places should respond a http 201 OK with no image', () => {
        var newPlace = {
            name: 'Londre',
            author: 'Patrick',
            review: 2
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Location', /places/)
            .expect(201);
    });

    it('POST /api/places should respond a http 201 OK with an image', () => {

        var newPlace = {
            name: 'Londre',
            author: 'Patrick',
            review: 2,
            image: {
                url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
                title: 'bworld place'
            }
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Location', /places/)
            .expect(201);

    });

    it('POST /api/places should respond a http 400 KO', () => {

        var newPlace = {
            name: '',
            author: 'Pat',
            review: 2
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(400);

    });

    it('POST /api/places should respond a http 400 KO', () => {

        const app = new App(new Place(new PlaceData())).app;
        var newPlace = {
            name: 'Londre &',
            author: 'Patrickmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
            review: 2,
            image: {
                url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
                title: ''
            }
        };
        return request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(400);

    });*/
});
