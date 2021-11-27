import dotenv from "dotenv";

dotenv.config();
import Debug from "debug";
import chalk from "chalk";
import mongoose from "mongoose";
import supertest from "supertest";

import { initializeServer, app } from "..";
import initializeMongo from "../../database";
import Usernode from "../../database/models/usernode";

const debug = Debug("escroom:testing:endpoints");

const request = supertest(app);
jest.setTimeout(20000);
let server;
beforeAll(async () => {
  await initializeMongo(process.env.MONGODB_STRING_TEST);
  await Usernode.deleteMany({});
  server = await initializeServer(process.env.SERVER_PORT_TEST);
  await Usernode.create({
    username: "guest",
    _id: "619cd1c5c5e491432a86e463",
    password: "guest",
    is_admin: false,
  });
});

afterAll((done) => {
  server.close(async () => {
    await Usernode.deleteMany({});
    await mongoose.connection.close();
    debug(chalk.red("Server conection ended"));
    done();
  });
});
beforeEach(async () => {
  await Usernode.create({
    username: "guest1",
    _id: "619cd1c5c5e491432a86e461",
    password: "guest1",
    is_admin: false,
  });
});
afterEach(async () => {
  await Usernode.deleteMany({});
});
describe("Given a /login endpoint", () => {
  describe("When a POST request arrives with a bad username and password", () => {
    test("Then it should respond with a 401 error", async () => {
      await request
        .post("/api/nodejs/login")
        .send({ username: "a", password: "a" })
        .expect(401);
    });
  });
});

describe("Given a /profiles endpoint", () => {
  describe("When a GET request arrives with an user", () => {
    test("Then it should respond with the user information", async () => {
      const expectedUser = {
        is_admin: false,
        username: "guest1",
        password: "guest1",
        id: "619cd1c5c5e491432a86e461",
      };
      const { body } = await request
        .get("/api/nodejs/profiles")
        .send({ username: "guest1" })
        .expect(200);

      expect(body).toEqual(expectedUser);
    });
  });
  describe("When a GET request arrives with a bad user", () => {
    test("Then it should respond with a 404", async () => {
      await request.get("/api/nodejs/profiles").send({}).expect(404);
    });
  });
  describe("When a GET request arrives without an user", () => {
    test("Then it should respond with a 404", async () => {
      await request.get("/api/nodejs/profiles").expect(404);
    });
  });
});

describe("Given a /users endpoint", () => {
  describe("When a GET request arrives and no users are found", () => {
    test("Then it should respond with 404", async () => {
      await request.get("/api/nodejs/users/a").expect(404);
    });
  });
  describe("When a GET request arrives and there are users", () => {
    test("Then it should respond with a 200", async () => {
      await request.get("/api/nodejs/users").expect(200);
    });
  });
});

describe("Given a /users/latest endpoint", () => {
  describe("When a GET request arrives and no users are found", () => {
    test("Then it should resond with a 404", async () => {
      await request.get("/api/nodejs/users/latest/a").expect(404);
    });
  });
  describe("When a GET request arrives and there are users", () => {
    test("Then it should respond with a 200", async () => {
      await request.get("/api/nodejs/users/latest").expect(200);
    });
  });
});
