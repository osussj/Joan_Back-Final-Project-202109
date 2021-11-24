import express from "express";
import createQuestion from "../controller/challengeController";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/node/question", auth, createQuestion);

export default router;
