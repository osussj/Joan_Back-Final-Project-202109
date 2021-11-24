import express from "express";
import Question from "../../database/models/question";

class ErrorCode extends Error {
  code: number | undefined;
}
const createQuestion = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const { question, answer, hint } = req.body;
  try {
    const createdQuestion = await Question.create({
      question,
      answer,
      hint,
    });
    res.json(createdQuestion);
  } catch {
    const error = new ErrorCode("Bad question provided");
    error.code = 400;
    next(error);
  }
};

export default createQuestion;
