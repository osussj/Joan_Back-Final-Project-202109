import express from "express";

import loginUserNode from "../controller/userNodeController";

const router = express.Router();

router.post("/login", loginUserNode);

export default router;
