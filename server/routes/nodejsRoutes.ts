import express from "express";

import {
  loginUserNode,
  getUserNode,
  getAllUsers,
  getLatestUsers,
} from "../controller/userNodeController";

const router = express.Router();

router.post("/login", loginUserNode);
router.get("/profiles", getUserNode);
router.get("/users", getAllUsers);
router.get("/users/latest", getLatestUsers);

export default router;
