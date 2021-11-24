import dotenv from "dotenv";

dotenv.config();
import Debug from "debug";
import chalk from "chalk";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import supertest from "supertest";

import { initializeServer, app } from "..";
import initializeMongo from "../../database";
import User from "../../database/models/user";

const debug = Debug("escroom:testing:endpoints");

const request = supertest(app);
jest.setTimeout(20000);
let server;
let token;
beforeAll(async () => {
  await initializeMongo(process.env.MONGODB_STRING_TEST);
  await User.deleteMany({});
  server = await initializeServer(process.env.SERVER_PORT_TEST);
  await User.create({
    name: "guest",
    username: "guest",
    password: await bcrypt.hash("guest", 10),
    email: "guest@admin.com",
    avatar: "guest.jpg",
    _id: "619cd1c5c5e491432a86e463",
  });
  const loginResponse = await request
    .post("/api/user/login")
    .send({ username: "guest", password: "guest" })
    .expect(200);
  token = loginResponse.body.token;
});

afterAll((done) => {
  server.close(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
    debug(chalk.red("Server conection ended"));
    done();
  });
});
beforeEach(async () => {
  await User.create({
    name: "admin",
    username: "admin",
    password: await bcrypt.hash("admin", 10),
    email: "admin@admin.com",
    avatar: "admin.jpg",
  });
});

afterEach(async () => {});

describe("Given a /login endpoint", () => {
  describe("When a POST request arrives with a bad username and password", () => {
    test("Then it should respond with a 401 error", async () => {
      await request
        .post("/api/user/login")
        .send({ username: "a", password: "a" })
        .expect(401);
    });
  });
});
describe("Given a /register endpoint", () => {
  describe("When a POST request arrives with bad parameters", () => {
    test("Then it should respond with a 400 error", async () => {
      await request.post("/api/user/register").send({}).expect(400);
    });
  });
  describe("When a POST request arrives with the right parameters", () => {
    test("Then it should respond with a 200", async () => {
      const user = {
        name: "manolo",
        username: "manolo",
        password: await bcrypt.hash("hola123", 10),
        email: "manolo@manolo.com",
        avatar: "manolo.jpg",
      };
      await request.post("/api/user/register").send(user).expect(200);
    });
  });
});
describe("Given a /profile endpoint", () => {
  describe("When a GET request arrives without being authorized", () => {
    test("Then it should respond with a 401 error", async () => {
      await request.get("/api/user/profile").expect(401);
    });
  });
  describe("When a GET request arrives with the user authorized", () => {
    test("Then it should respond with a 200", async () => {
      const expectedUserInfo = {
        avatar: "guest.jpg",
        email: "guest@admin.com",
        name: "guest",
        username: "guest",
      };
      const { body } = await request
        .get("/api/user/profile")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(body).toMatchObject(expectedUserInfo);
    });
  });
  describe("When a GET request arrives with an invalid token", () => {
    test("Then it should respond with a 401 error", async () => {
      await request
        .get("/api/user/profile")
        .set("Authorization", `Bearer a`)
        .expect(401);
    });
  });
});
describe("Given a /update endpoint", () => {
  describe("When a PUT request arrives with the user authorized", () => {
    test("Then it should respond with a 200", async () => {
      await request
        .put("/api/user/profile/update")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "guest12",
          name: "guest12",
          email: "guest@admin.com",
          avatar: "guest.jpg",
        })
        .expect(200);
    });
  });
  describe("When a PUT request arrives without being authorized", () => {
    test("Then it should respond with a 401 error", async () => {
      await request.put("/api/user/profile/update").expect(401);
    });
  });
  describe("When a GET request arrives with an invalid token", () => {
    test("Then it should respond with a 401 error", async () => {
      await request
        .put("/api/user/profile/update")
        .set("Authorization", `Bearer a`)
        .expect(401);
    });
  });
});
