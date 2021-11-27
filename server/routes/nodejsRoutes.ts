import express from "express";

import {
  loginUserNode,
  getUserNode,
  getAllUsers,
} from "../controller/userNodeController";

const router = express.Router();

router.post("/login", loginUserNode);
router.get("/profiles", getUserNode);
router.get("/users", getAllUsers);

export default router;
