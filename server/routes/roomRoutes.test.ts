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
import Question from "../../database/models/question";

const debug = Debug("escroom:testing:endpoints");

const request = supertest(app);

jest.setTimeout(20000);

let server;

const fakeQuestions = [
  {
    _id: "619e0282bd1c3ca34c68a902",
    question: "What is the mark password",
    answer: "snowflake",
    hint: "Remember to look at the source code",
  },
  {
    _id: "619e0282bd1c3ca34c68a905",
    question: "What is the guest password",
    answer: "pepe",
    hint: "There is no hint",
  },
];
const fakeQuestionsWithId = fakeQuestions.map((fakeQuestion) => {
  const fakeQuestionWithId = {
    ...fakeQuestion,
    // eslint-disable-next-line no-underscore-dangle
    id: fakeQuestion._id,
  };
  // eslint-disable-next-line no-underscore-dangle
  delete fakeQuestionWithId._id;

  return fakeQuestionWithId;
});
let token;

beforeAll(async () => {
  await initializeMongo(process.env.MONGODB_STRING_TEST);
  await User.deleteMany({});
  server = await initializeServer(process.env.SERVER_PORT_TEST);
  await User.create({
    name: "charles",
    username: "cors",
    password: await bcrypt.hash("cors", 10),
    email: "cors@admin.com",
    avatar: "cors.jpg",
  });
  const loginResponse = await request
    .post("/api/user/login")
    .send({ username: "cors", password: "cors" })
    .expect(200);
  token = loginResponse.body.token;
});

afterAll((done) => {
  server.close(async () => {
    await User.deleteMany({});
    await Question.deleteMany({});
    await mongoose.connection.close();
    debug(chalk.red("Server conection ended"));
    done();
  });
});

beforeEach(async () => {
  await Question.create(fakeQuestions[0]);
  await Question.create(fakeQuestions[1]);
});

afterEach(async () => {
  await Question.deleteMany({});
});

describe("Given a /node/question endpoint", () => {
  describe("When a GET request arrives with the bad request", () => {
    test("Then it should respond with a 404 error", async () => {
      await request
        .get("/api/room/node/questions")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
  });
  describe("When a GET request arrives with the token and the right parameters", () => {
    test("Then it should respond with the questions", async () => {
      const { body } = await request
        .get("/api/room/node/question")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(body).toEqual(fakeQuestionsWithId);
    });
  });
  describe("When a GET request arrives without the token", () => {
    test("Then it should respond with a 401 error", async () => {
      await request
        .get("/api/room/node/question")
        .set("Authorization", `Bearer aa`)
        .expect(401);
    });
  });
  describe("When a POST request arrives with the bad request", () => {
    test("Then it should respond with a 404 error", async () => {
      await request
        .post("/api/room/node/questions")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
  });
  describe("When a POST request arrives with the token and the right parameters", () => {
    test("Then it should respond with the new question", async () => {
      const newQuestion = {
        question: "What is the cors password?",
        answer: "badcors",
        hint: "Ask charles",
      };
      const { body } = await request
        .post("/api/room/node/question")
        .set("Authorization", `Bearer ${token}`)
        .send(newQuestion)
        .expect(200);

      expect(body).toMatchObject(newQuestion);
    });
  });
  describe("When a POST request arrives without the token", () => {
    test("Then it should respond with a 401 error", async () => {
      await request
        .post("/api/room/node/question")
        .set("Authorization", `Bearer aa`)
        .expect(401);
    });
  });
  describe("When a PUT request arrives with the bad request", () => {
    test("Then it should respond with a 404 error", async () => {
      await request
        .put("/api/room/node/questions")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
  });
  describe("When a PUT request arrives with the token and the right parameters", () => {
    test("Then it should respond the question updated", async () => {
      const updatedQuestion = {
        id: "619e0282bd1c3ca34c68a905",
        question: "What is the test password?",
      };
      const { body } = await request
        .put("/api/room/node/question")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedQuestion)
        .expect(200);

      expect(body).toMatchObject(updatedQuestion);
    });
  });
});
