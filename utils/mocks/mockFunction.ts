import express, { Request, Response } from "express";

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

interface UserInfo {
  id;
  username;
  name;
  email;
  avatar;
  isAdmin;
}
export interface RequestAuth extends express.Request {
  userInfo?: UserInfo;
}
export const mockAuthRequest = (body?: any, header?: any) => {
  const req = {} as RequestAuth;
  req.body = body;
  req.header = jest.fn().mockReturnValue(header);
  return req;
};
