import express from "express";
import {
  createQuestion,
  updateQuestion,
  getQuestion,
  deleteQuestion,
} from "../controller/challengeController";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/node/question", auth, getQuestion);
router.post("/node/question", auth, createQuestion);
router.put("/node/question", auth, updateQuestion);
router.delete("/node/question", auth, deleteQuestion);

export default router;
