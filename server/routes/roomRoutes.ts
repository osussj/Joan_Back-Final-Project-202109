import express from "express";
import {
  createQuestion,
  updateQuestion,
  getQuestion,
} from "../controller/challengeController";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/node/question", auth, getQuestion);
router.post("/node/question", auth, createQuestion);
router.put("/node/question", auth, updateQuestion);

export default router;
