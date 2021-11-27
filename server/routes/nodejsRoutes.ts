import express from "express";

import { loginUserNode, getUserNode } from "../controller/userNodeController";

const router = express.Router();

router.post("/login", loginUserNode);
router.get("/profiles", getUserNode);

export default router;
