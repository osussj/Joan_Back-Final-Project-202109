import express from "express";

import { createUser, loginUser, getUser } from "../controller/userController";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", auth, getUser);

export default router;
