import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import User from "../../database/models/user";

class ErrorCode extends Error {
  code: number | undefined;
}
export const createUser = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const { name, username, password, email, avatar } = req.body;
  try {
    const user = await User.create({
      name,
      username,
      password: await bcrypt.hash(password, 10),
      email,
      avatar,
    });
    res.json(user);
  } catch {
    const error = new ErrorCode("Bad credentials provided");
    error.code = 400;
    next(error);
  }
};

export const loginUser = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    const error = new ErrorCode("Wrong credentials");
    error.code = 401;
    next(error);
  } else {
    const rightPassword = await bcrypt.compare(password, user.password);
    if (!rightPassword) {
      const error = new ErrorCode("Wrong credentials");
      error.code = 401;
      next(error);
    } else {
      const token = jwt.sign(
        {
          name: user.name,
          username: user.username,
          id: user.id,
          email: user.email,
          avatar: user.avatar,
        },
        process.env.SECRET_HASH
      );
      res.json({ token });
    }
  }
};

export const getUser = (req, res: express.Response, next) => {
  const user = req.userInfo;
  try {
    res.json(user);
  } catch (error) {
    next(error);
  }
};
