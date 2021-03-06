import express from "express";
import Challenge from "../../database/models/challenge";
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
  const challengeId = "619f898acd6286b7a6818867";
  try {
    const createdQuestion = await Question.create({
      question,
      answer,
      hint,
    });
    await Challenge.findByIdAndUpdate(
      { _id: challengeId },
      { $push: { questions: createdQuestion.id } }
    );
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
    if (!question) {
      const error = new ErrorCode("Bad question provided");
      error.code = 400;
      return next(error);
    }
    res.json(question);
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

export const deleteQuestion = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const { id } = req.body;
  try {
    const question = await Question.findByIdAndDelete(id);
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

export const getChallenge = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  try {
    const challenge = await Challenge.find().populate("questions");
    if (!challenge) {
      const error = new ErrorCode("No challenge found");
      error.code = 404;
      return next(error);
    }
    res.json(challenge);
  } catch (error) {
    next(error);
  }
};

export const getRoom = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  try {
    const challenge = await Challenge.find();
    if (!challenge) {
      const error = new ErrorCode("No challenge found");
      error.code = 404;
      return next(error);
    }
    res.json(challenge);
  } catch (error) {
    next(error);
  }
};
