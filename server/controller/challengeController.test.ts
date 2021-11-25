import { Request } from "express";
import Question from "../../database/models/question";
import { mockResponse } from "../../utils/mocks/mockFunction";
import {
  createQuestion,
  deleteQuestion,
  getQuestion,
  updateQuestion,
} from "./challengeController";

jest.mock("../../database/models/question");
class ErrorCode extends Error {
  code: number | undefined;
}

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

describe("Given a getQuestion function", () => {
  describe("When it receives an array of questions", () => {
    test("Then it should invoke the method json with the questions", async () => {
      const questions = [
        {
          question: "What is the mark password",
          answer: "snowflake",
          hint: "Remember to look at the source code",
        },
        {
          question: "What is the guest password?",
          answer: "pepe",
          hint: "There is no hint",
        },
      ];
      const res = mockResponse();
      Question.find = jest.fn().mockResolvedValue(questions);

      await getQuestion(null, res, null);

      expect(res.json).toHaveBeenCalledWith(questions);
    });
  });
  describe("When the promise is rejected", () => {
    test("Then it should invoke next with the error", async () => {
      const next = jest.fn();

      Question.find = jest.fn().mockRejectedValue(null);
      await getQuestion(null, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe("When the question is not found", () => {
    test("Then it should invoke the next function with the error", async () => {
      const question = {};
      const expectedError = new ErrorCode("No question found");
      expectedError.code = 404;
      const req = {
        body: question,
      } as Request;
      const next = jest.fn();
      Question.find = jest.fn().mockResolvedValue(null);

      await getQuestion(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});

describe("Given an updateQuestion function", () => {
  describe("When it receives a question", () => {
    test("Then it should invoke the method json with the updatedQuestion", async () => {
      const updatedQuestion = {
        id: "6185c1af9f1964f08e62d131",
        question: "What a test",
        answer: "Yes",
        hint: "Rtfm",
      };
      const req = {
        body: updatedQuestion,
      } as Request;
      const res = mockResponse();

      Question.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedQuestion);
      await updateQuestion(req, res, null);

      expect(res.json).toHaveBeenCalledWith(updatedQuestion);
    });
  });
  describe("When it receives a non existent question", () => {
    test("Then it should invoke a next function with a 400 error", async () => {
      Question.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      const req = {
        body: {
          id: "6222d83be45c3a8801f1440d",
        },
      } as Request;
      const next = jest.fn();
      const expectedError = new ErrorCode("Bad question provided");
      expectedError.code = 400;

      await updateQuestion(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
  describe("When the promise is rejected", () => {
    test("Then it should invoke next function", async () => {
      const req = {
        body: {},
      } as Request;
      const next = jest.fn();

      Question.findByIdAndUpdate = jest.fn().mockRejectedValue(null);
      await updateQuestion(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a deleteQuestion function", () => {
  describe("When it receives a question", () => {
    test("Then it should invoke the method json with the deleted question", async () => {
      const deletedQuestion = {
        id: "6185c1af9f1964f08e62d131",
        question: "What a test",
        answer: "Yes",
        hint: "Rtfm",
      };
      const req = {
        body: deletedQuestion,
      } as Request;
      const res = mockResponse();

      Question.findByIdAndDelete = jest.fn().mockResolvedValue(deletedQuestion);
      await deleteQuestion(req, res, null);

      expect(res.json).toHaveBeenCalledWith(deletedQuestion);
    });
  });
  describe("When it receives a non existent question", () => {
    test("Then it should invoke a next function with a 404 error", async () => {
      Question.findByIdAndDelete = jest.fn().mockResolvedValue(null);
      const req = {
        body: {
          id: "6222d83be45c3a8801f1440d",
        },
      } as Request;
      const next = jest.fn();
      const expectedError = new ErrorCode("No question found");
      expectedError.code = 404;

      await deleteQuestion(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
  describe("When the promise is rejected", () => {
    test("Then it should invoke next function", async () => {
      const req = {
        body: {},
      } as Request;
      const next = jest.fn();

      Question.findByIdAndDelete = jest.fn().mockRejectedValue(null);
      await deleteQuestion(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
