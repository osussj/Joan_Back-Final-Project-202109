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
let server;
beforeAll(async () => {
  await initializeMongo(process.env.MONGODB_STRING_TEST);
  await User.deleteMany({});
  server = await initializeServer(process.env.SERVER_PORT_TEST);
});

afterAll((done) => {
  server.close(async () => {
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

afterEach(async () => {
  await User.deleteMany({});
});

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
