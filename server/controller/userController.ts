import User from "../../database/models/user";

const bcrypt = require("bcrypt");

class ErrorCode extends Error {
  code: number | undefined;
}
const createUser = async (req, res, next) => {
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

export default createUser;
