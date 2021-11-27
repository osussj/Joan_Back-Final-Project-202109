import express from "express";

import {
  createUser,
  loginUser,
  getUser,
  updateUser,
} from "../controller/userController";
import auth from "../middlewares/auth";
import firebase from "../middlewares/firebase";
import upload from "../middlewares/upload";

const router = express.Router();

router.post("/register", upload.single("avatar"), firebase, createUser);
router.post("/login", loginUser);
router.get("/profile", auth, getUser);
router.put("/profile/update", auth, updateUser);
export default router;
