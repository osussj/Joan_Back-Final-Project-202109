import express from "express";
import Question from "../../database/models/question";

class ErrorCode extends Error {
  code: number | undefined;
}
export const createQuestion = async (
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

export const updateQuestion = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const { id } = req.body;
  try {
    const question = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (question) {
      res.json(question);
    } else {
      const error = new ErrorCode("Bad question provided");
      error.code = 400;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export const getQuestion = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  try {
    const question = await Question.find();
    if (!question) {
      const error = new ErrorCode("No question found");
      error.code = 404;
      return next(error);
    }
    res.json(question);
  } catch (error) {
    next(error);
  }
};
