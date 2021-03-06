import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request } from "express";
import User from "../../database/models/user";
import { mockRequest, mockResponse } from "../../utils/mocks/mockFunction";
import { createUser, getUser, loginUser, updateUser } from "./userController";

jest.mock("../../database/models/user", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock("jsonwebtoken");
class ErrorCode extends Error {
  code: number | undefined;
}
describe("Given a createUser function", () => {
  describe("When it receives a request with the credentials of the user", () => {
    test("Then it should invoke the method json with the corresponding credentials", async () => {
      const user = {
        name: "manolo",
        username: "manolo",
        password: await bcrypt.hash("hola123", 10),
        email: "manolo@manolo.com",
        avatar: "manolo.jgp",
      };
      const req = {
        body: user,
        file: user.avatar,
      };
      const res = mockResponse();
      User.create = jest.fn().mockResolvedValue(user);
      await createUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(user);
    });
  });
  describe("When it receives a request with bad credentials of the user", () => {
    test("Then it should invoke the next function", async () => {
      const avatar = "";
      const user = {};
      const error = {
        error: "Bad credentials provided",
        code: 400,
      };
      const req = {
        body: user,
        file: avatar,
      };
      const next = jest.fn();
      User.create = jest.fn().mockRejectedValue(user);

      await createUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(error).toHaveProperty("error", "Bad credentials provided");
      expect(error.code).toBe(400);
    });
  });
});

describe("Given a loginUser function", () => {
  describe("When it receives a incorrect username", () => {
    test("Then it should invoke a next function with error(code 401)", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      const req = {
        body: {
          username: "addmin",
          password: "admmin",
        },
      } as Request;
      const next = jest.fn();
      const expectedError = new ErrorCode("Wrong credentials");
      expectedError.code = 401;

      await loginUser(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
    });
  });
  describe("When it receives a correct username and incorrect password", () => {
    test("Then it should invoke a next function with error(code 401)", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        username: "addmin",
        password: "admmin",
        id: "23",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      const next = jest.fn();
      const req = {
        body: {
          username: "addmin",
          password: "admmin",
        },
      } as Request;
      const expectedError = new ErrorCode("Wrong credentials");
      expectedError.code = 401;

      await loginUser(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
  describe("When it receives a correct username and a correct password", () => {
    test("Then it should invoke res.json with an object with a brand new token inside", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        username: "admin",
        password: "admin",
        id: "23",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      const expectedToken = "someExpectedToken";
      jwt.sign = jest.fn().mockReturnValue(expectedToken);
      const res = mockResponse();
      const req = {
        body: {
          username: "admin",
          password: "admin",
        },
      } as Request;
      const expectedResponse = {
        token: expectedToken,
      };

      await loginUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});

describe("Given a getUser function", () => {
  describe("When it receives a correct user", () => {
    test("Then it should invoke res.json with an object with the user info", () => {
      const req = {
        userInfo: {
          username: "admin",
          email: "admin@admin.com",
          id: "12",
          avatar: "admin.jpg",
        },
      };
      const user = req.userInfo;
      const res = mockResponse();

      getUser(req, res, null);
      expect(res.json).toHaveBeenCalledWith(user);
    });
  });
  describe("When it receives an invalid user", () => {
    test("Then it should invoke next function with error(code 401) ", () => {
      const req = mockRequest();
      const next = jest.fn();

      getUser(req, null, next);
      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given updateUser", () => {
  let user;
  let req;
  beforeEach(() => {
    user = {
      name: "test",
      username: "test",
      id: "1234",
    };
    req = {
      userInfo: user,
      body: user,
    };
  });
  describe("When the user is found and edited without error", () => {
    test("Then it should call the method json with the user info updated", async () => {
      const res = mockResponse();
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(user);
      await updateUser(req, res, null);

      expect(res.json).toHaveBeenCalledWith(user);
    });
  });
  describe("When the user is not found", () => {
    test("Then it should call next with the error", async () => {
      const error = new Error("User not found");
      const errorcode = 404;

      const next = jest.fn().mockResolvedValue(error);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      await updateUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", errorcode);
    });
  });
  describe("When the user is found but the promise is rejected", () => {
    test("Then it should call next with the error", async () => {
      const next = jest.fn();

      User.findByIdAndUpdate = jest.fn().mockRejectedValue(user);
      await updateUser(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
