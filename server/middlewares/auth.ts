import jwt from "jsonwebtoken";
import { RequestAuth } from "../../utils/mocks/mockFunction";

class ErrorCode extends Error {
  code: number | undefined;
}
const auth = (req: RequestAuth, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    const error = new ErrorCode("Authorization error");
    error.code = 401;
    next(error);
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      const error = new ErrorCode("Token is incorrect");
      error.code = 401;
      next(error);
    } else {
      try {
        const { id, username, name, email, avatar } = jwt.verify(
          token,
          process.env.SECRET_HASH
        );
        req.userInfo = { id, username, name, email, avatar };
        next();
      } catch {
        const error = new ErrorCode("Verify error");
        error.code = 401;
        next(error);
      }
    }
  }
};
export default auth;
