import { Request, Response } from "express";

export const mockRequest = () => {
  const req = {} as Request;
  return req;
};
export const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();

  return res;
};
