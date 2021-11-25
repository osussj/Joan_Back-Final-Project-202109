import jwt from "jsonwebtoken";
import CustomError from "../../utils/interfaces/error/customError";

import { mockAuthRequest } from "../../utils/mocks/mockFunction";
import auth from "./auth";

jest.mock("jsonwebtoken");

describe("Given a auth function", () => {
  describe("When it receives an unauthorized request", () => {
    test("Then it should return error code 401 and Authorization error message", () => {
      const req = mockAuthRequest(null, null);
      const error = new CustomError("Authorization error");
      error.code = 401;
      const next = jest.fn();

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });

  describe("When it receives a Authorization request without token ", () => {
    test("Then it should return error code 401 and Token is incorrect message", () => {
      const req = mockAuthRequest(null, "12");
      const error = new CustomError("Token is incorrect");
      error.code = 401;
      const next = jest.fn();

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });

  describe("When it receives a Authorization request with a valid token ", () => {
    test("Then it should invoke the next function without error", () => {
      const req = mockAuthRequest(
        null,
        "Bearer DGhKdN5jBP2ndIeLQpXumjYHCAkx0UeIGVAJMLhAJLc"
      );
      jwt.verify = jest.fn().mockReturnValue({
        id: "12",
        username: "manolo",
        name: "manolo",
        email: "manolo@manolo.com",
        avatar: "manolo.jgp",
      });

      const next = jest.fn();
      auth(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a Authorization request with wrong token ", () => {
    test("Then it should invoke next function with error and return error code 401 and Verify error message", () => {
      const req = mockAuthRequest(null, "Bearer aaa");
      const next = jest.fn();
      const expectedError = new CustomError("Verify error");
      expectedError.code = 401;

      jwt.verify = jest.fn().mockReturnValue(null);
      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
});
