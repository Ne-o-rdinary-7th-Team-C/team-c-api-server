const express = require("express");
const userController = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.post("/validation", userController.validateIdController);
userRouter.post("/register", userController.registerUserController);

module.exports = userRouter;
