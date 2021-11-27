import initializeMongo from ".";

const mongoose = require("mongoose");

jest.mock("mongoose");

describe("Given initializeMongo", () => {
  let resolve;
  let reject;

  beforeEach(() => {
    resolve = jest.fn();
    reject = jest.fn();
    (global.Promise as any) = jest
      .fn()
      .mockImplementation((promiseCallback) => {
        promiseCallback(resolve, reject);
      });
  });

  describe("When mongoose.connection resolves without error", () => {
    test("Should call resolve", async () => {
      const error = null;
      mongoose.connect.mockImplementation(
        (connectionString, connectCallback) => {
          connectCallback(error);
        }
      );

      await initializeMongo("a");

      expect(resolve).toHaveBeenCalled();
    });
  });

  describe("When mongoose.connection resolves with error", () => {
    test("Should call reject", async () => {
      const error = new Error("error");
      mongoose.connect.mockImplementation(
        (connectionString, connectCallback) => {
          connectCallback(error);
        }
      );

      await initializeMongo("a");

      expect(reject).toHaveBeenCalled();
    });
  });
});
