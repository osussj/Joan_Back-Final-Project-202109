import express from "express";

const createUser = require("../controller/userController");

const router = express.Router();

router.post("/register", createUser);

export = router;
