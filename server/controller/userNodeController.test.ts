import { Request } from "express";
import Usernode from "../../database/models/usernode";
import { mockResponse } from "../../utils/mocks/mockFunction";
import loginUserNode from "./userNodeController";

jest.mock("../../database/models/usernode");
jest.setTimeout(5000);
class ErrorCode extends Error {
  code: number | undefined;
}

describe("Given a loginUser function", () => {
  describe("When it receives a incorrect username", () => {
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
