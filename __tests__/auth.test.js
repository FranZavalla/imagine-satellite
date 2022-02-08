const request = require("supertest");
const { server, app } = require("../src/index");

describe("POST /auth/register", () => {
  it("Correct register. Must reply with a key and true authorization", async () => {
    const response = await request(app)
      .post("/auth/register")
      .set("Accept", "application/json")
      .send({ username: "testUser", password: "testPassword" });

    expect(response.status).toEqual(201);
    expect(response.body.auth).toEqual(true);
    expect(response.body.key);
  });

  it("Incorrect register. Must reply with false authorization and 'username and password required'", async () => {
    const response = await request(app)
      .post("/auth/register")
      .set("Accept", "application/json");

    expect(response.status).toEqual(400);
    expect(response.body.auth).toEqual(false);
    expect(response.body.msg.length).toEqual(4);
  });

  it("Incorrect register. Must reply with false authorization and 'username already exists'", async () => {
    const response = await request(app)
      .post("/auth/register")
      .set("Accept", "application/json")
      .send({ username: "testUser", password: "testPassword" });

    expect(response.status).toEqual(400);
    expect(response.body.auth).toEqual(false);
    expect(response.body.msg).toEqual("Your username already exist");
  });

  it("Incorrect register. Must reply with false authorization and 'username too short'", async () => {
    const response = await request(app)
      .post("/auth/register")
      .set("Accept", "application/json")
      .send({ username: "user", password: "testPassword" });

    expect(response.status).toEqual(400);
    expect(response.body.auth).toEqual(false);
    expect(response.body.msg).toEqual([
      "Username must have at least 5 characters and a maximum of 30",
    ]);
  });

  it("Incorrect register. Must reply with false authorization and 'username too long'", async () => {
    const response = await request(app)
      .post("/auth/register")
      .set("Accept", "application/json")
      .send({
        username: "testUserWithTooLongUsernameForThisAPI",
        password: "testPassword",
      });

    expect(response.status).toEqual(400);
    expect(response.body.auth).toEqual(false);
    expect(response.body.msg).toEqual([
      "Username must have at least 5 characters and a maximum of 30",
    ]);
  });

  it("Incorrect register. Must reply with false authorization and 'password too short'", async () => {
    const response = await request(app)
      .post("/auth/register")
      .set("Accept", "application/json")
      .send({
        username: "testUser2",
        password: "pass",
      });

    expect(response.status).toEqual(400);
    expect(response.body.auth).toEqual(false);
    expect(response.body.msg).toEqual(["Password must be 7 chars at least"]);
  });
});

describe("POST /auth/login", () => {
  it("Correct log in. Must reply with a key and true authorization", async () => {
    const response = await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({ username: "testUser", password: "testPassword" });

    expect(response.status).toEqual(200);
    expect(response.body.auth).toEqual(true);
    expect(response.body.key);
  });

  it("Inorrect log in. Must reply with a false authorization and 'missing password or username'", async () => {
    const response = await request(app)
      .post("/auth/login")
      .set("Accept", "application/json");

    expect(response.status).toEqual(400);
    expect(response.body.auth).toEqual(false);
    expect(response.body.msg.length).toEqual(2);
  });

  it("Inorrect log in. Must reply with a false authorization and 'incorrect username or password'", async () => {
    const response = await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({ username: "testUser", password: "incorrectPassword" });

    expect(response.status).toEqual(400);
    expect(response.body.auth).toEqual(false);
    expect(response.body.msg).toEqual("Incorrect username or password");
  });
});

afterAll(() => {
  server.close();
});
