const request = require("supertest");
const { server, app } = require("../src/index");
const db = require("../src/db");

const satellites = require("../data/satellitesToGet");

let key;

beforeAll(async () => {
  db.models.Users.sync({ force: true });
  db.models.Satellites.sync({ force: true });
  db.models.SpaceTracks.sync({ force: true });

  const response = await request(app)
    .post("/auth/register")
    .set("Accept", "application/json")
    .send({ username: "testUser", password: "testPassword" });
  key = response.body.key;
});

describe("GET /satellite and /satelliteByDistance without data", () => {
  it("Get satellites from empty database", async () => {
    const response = await request(app)
      .get("/satellite")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body.msg).toEqual(
      "There are no satellites in the database yet"
    );
  });

  it("Get satellites by distance from empty database", async () => {
    const response = await request(app)
      .get("/satelliteByDistance?l1=0.0&l2=0.0&d=1000000")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body.msg).toEqual(
      "There are no satellites within 1000000 km of (0.0,0.0)"
    );
  });
});

describe("GET /satellite", () => {
  it("Create satellites", async () => {
    for (let i = 0; i < satellites.length; i++) {
      const response = await request(app)
        .post(`/satellite?key=${key}`)
        .set("Accept", "application/json")
        .send(satellites[i]);

      expect(response.status).toEqual(201);
    }
  });

  it("Get all 5 satellites in database", async () => {
    const response = await request(app)
      .get("/satellite")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(5);
  });
});

describe("GET /satelliteByName", () => {
  it("Get STARLINK-1709 satellite", async () => {
    const response = await request(app)
      .get("/satelliteByName?name=STARLINK-1709")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body.satellite.launch).toEqual("5ef6a2090059c33cee4a828b");
  });

  it("Get inexistent satellite", async () => {
    const response = await request(app)
      .get("/satelliteByName?name=NotFound")
      .set("Accept", "application/json");

    expect(response.status).toEqual(400);
    expect(response.body.msg).toEqual("Satellite NotFound not found");
  });

  it("Get without name parameter", async () => {
    const response = await request(app)
      .get("/satelliteByName")
      .set("Accept", "application/json");

    expect(response.status).toEqual(400);
    expect(response.body.msg.length).toEqual(1);
  });
});

describe("GET /satelliteByDistance", () => {
  it("Get satellites correctly", async () => {
    const response = await request(app)
      .get("/satelliteByDistance?l1=51&l2=92&d=1000")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body.satellitesInDistance.length).toEqual(1);
  });

  it("Get satellites with out of bounds parameter", async () => {
    const response = await request(app)
      .get("/satelliteByDistance?l1=91&l2=92&d=1000")
      .set("Accept", "application/json");

    expect(response.status).toEqual(400);
    expect(response.body.msg.length).toEqual(1);
  });

  it("Get satellites without parameters", async () => {
    const response = await request(app)
      .get("/satelliteByDistance")
      .set("Accept", "application/json");

    expect(response.status).toEqual(400);
    expect(response.body.msg.length).toEqual(6);
  });
});

afterAll(() => {
  server.close();
});
