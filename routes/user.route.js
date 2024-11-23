const express = require("express");
const registerUserController = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.post("/register", registerUserController);

module.exports = userRouter;
