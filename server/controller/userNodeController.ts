import express from "express";
import Usernode from "../../database/models/usernode";
import CustomError from "../../utils/interfaces/error/customError";

export const loginUserNode = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const { username, password } = req.body;
  const user = await Usernode.findOne({ username });
  if (!user) {
    const error = new CustomError("Wrong credentials");
    error.code = 401;
    next(error);
  } else {
    const userPassword = await Buffer.from(user.password, "base64");
    const userPasswordToString = userPassword.toString("utf-8");
    if (userPasswordToString !== password) {
      const error = new CustomError("Wrong credentials");
      error.code = 401;
      return next(error);
    }
    res.json({ message: `Welcome back ${username}` });
  }
};

export const getUserNode = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const { username } = req.body;
  try {
    const userProfile = await Usernode.findOne({ username });
    if (!userProfile) {
      const error = new CustomError("User not found");
      error.code = 404;
      return next(error);
    }
    res.json(userProfile);
  } catch (error) {
    next(error);
  }
};
