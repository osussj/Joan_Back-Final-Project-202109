import { Request } from "express";
import Question from "../../database/models/question";
import { mockResponse } from "../../utils/mocks/mockFunction";
import createQuestion from "./challengeController";

describe("Given a createQuestion function", () => {
  describe("When it receives a request with the question information", () => {
    test("Then it should invoke the method json with the corresponding information", async () => {
      const question = {
        question: "What is this test",
        answer: "I don't know",
        hint: "Ask Dan",
      };
      const req = {
        body: question,
      } as Request;
      const res = mockResponse();
      Question.create = jest.fn().mockResolvedValue(question);

      await createQuestion(req, res, null);

      expect(res.json).toHaveBeenCalledWith(question);
    });
  });
  describe("When it receives a request with bad information of the question", () => {
    test("Then it should invoke the next function", async () => {
      const question = {};
      const error = {
        error: "Bad question provided",
        code: 400,
      };
      const req = {
        body: question,
      } as Request;
      const next = jest.fn();
      Question.create = jest.fn().mockRejectedValue(question);

      await createQuestion(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(error).toHaveProperty("error", "Bad question provided");
      expect(error.code).toBe(400);
    });
  });
});
