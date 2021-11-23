import express from "express";

import { createUser, loginUser } from "../controller/userController";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);

export default router;
