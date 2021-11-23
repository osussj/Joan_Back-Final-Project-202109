import express from "express";

import createUser from "../controller/userController";

const router = express.Router();

router.post("/register", createUser);

export default router;
