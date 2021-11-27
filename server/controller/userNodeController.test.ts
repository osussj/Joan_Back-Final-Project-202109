import { Request } from "express";
import Usernode from "../../database/models/usernode";
import { mockResponse } from "../../utils/mocks/mockFunction";
import { getUserNode, loginUserNode } from "./userNodeController";

jest.mock("../../database/models/usernode");
jest.setTimeout(5000);
class ErrorCode extends Error {
  code: number | undefined;
}

describe("Given a loginUser function", () => {
  describe("When it receives an incorrect username", () => {
    test("Then it should invoke a next function with error(code 401)", async () => {
      Usernode.findOne = jest.fn().mockResolvedValue(null);
      const req = {
        body: {
          username: "addmin",
          password: "admmin",
        },
      } as Request;
      const next = jest.fn();
      const expectedError = new ErrorCode("Wrong credentials");
      expectedError.code = 401;

      await loginUserNode(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
    });
  });
  describe("When it receives a correct username and incorrect password", () => {
    test("Then it should invoke a next function with error(code 401)", async () => {
      Usernode.findOne = jest.fn().mockResolvedValue({
        username: "addmin",
        password: "admmin",
        id: "23",
      });
      const next = jest.fn();
      const req = {
        body: {
          username: "addmin",
          password: "admmin",
        },
      } as Request;
      const expectedError = new ErrorCode("Wrong credentials");
      expectedError.code = 401;

      await loginUserNode(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });
  describe("When it receives a correct username and a correct password", () => {
    test("Then it should invoke res.json with an object with a brand new token inside", async () => {
      const fakeUser = {
        username: "admin",
        password: "admin",
        id: "23",
      };
      Usernode.findOne = jest.fn().mockResolvedValue(fakeUser);
      (Buffer.from as any) = jest
        .spyOn(Buffer, "from")
        .mockReturnValue(fakeUser.password as any);
      const res = mockResponse();
      const req = {
        body: {
          username: fakeUser.username,
          password: fakeUser.password,
        },
      } as Request;
      const welcomeMessage = {
        message: `Welcome back ${fakeUser.username}`,
      };
      await loginUserNode(req, res, null);

      expect(res.json).toHaveBeenCalledWith(welcomeMessage);
    });
  });
});

describe("Given a getUserNode function", () => {
  describe("When it receives an incorrect username", () => {
    test("Then it should invoke a next function with error 404", async () => {
      Usernode.findOne = jest.fn().mockResolvedValue(null);
      const req = {
        body: {
          username: "guest",
        },
      } as Request;
      const next = jest.fn();
      const expectedError = new ErrorCode("User not found");
      expectedError.code = 404;

      await getUserNode(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
    });
  });
  describe("When it receives a correct username", () => {
    test("Then it should invoke the method json with the user information", async () => {
      const fakeUser = {
        username: "guest",
        is_admin: false,
        password: "fakePassword",
        id: "12",
      };
      const res = mockResponse();
      const req = {
        body: {
          username: fakeUser.username,
        },
      } as Request;

      Usernode.findOne = jest.fn().mockResolvedValue(fakeUser);
      await getUserNode(req, res, null);

      expect(res.json).toHaveBeenCalledWith(fakeUser);
    });
  });
  describe("When the promise is rejected", () => {
    test("Then it should call the next function", async () => {
      const next = jest.fn();
      const req = {
        body: {},
      } as Request;
      Usernode.findOne = jest.fn().mockRejectedValue(null);
      await getUserNode(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
