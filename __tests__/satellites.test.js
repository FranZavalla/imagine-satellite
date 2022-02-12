const request = require("supertest");
const { server, app } = require("../src/index");
const db = require("../src/db");

const correctSatellites = require("../data/correctSatellites.json");
const incorrectSatellites = require("../data/incorrectSatellites.json");

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

describe("POST /satellite", () => {
  it("Correct creation of the new satellite", async () => {
    const response = await request(app)
      .post(`/satellite?key=${key}`)
      .set("Accept", "application/json")
      .send(correctSatellites[0]);

    expect(response.status).toEqual(201);
    expect(response.body.created).toEqual(true);
  });

  it("Correct creation with some information in null", async () => {
    const response = await request(app)
      .post(`/satellite?key=${key}`)
      .set("Accept", "application/json")
      .send(correctSatellites[1]);

    expect(response.status).toEqual(201);
    expect(response.body.created).toEqual(true);
  });

  it("Incorrect creation, the basic information does not respect limits or types", async () => {
    const response = await request(app)
      .post(`/satellite?key=${key}`)
      .set("Accept", "application/json")
      .send(incorrectSatellites[0]);

    expect(response.status).toEqual(400);
    expect(response.body.msg.length).toEqual(4);
  });

  it("Incorrect creation, some space track information are null", async () => {
    const response = await request(app)
      .post(`/satellite?key=${key}`)
      .set("Accept", "application/json")
      .send(incorrectSatellites[1]);

    expect(response.status).toEqual(400);
    expect(response.body.msg.length).toEqual(2);
  });
});

afterAll(() => {
  server.close();
});
