const express = require("express");
const userController = require("../controllers/user.controller");
const { login, getUserNickname } = require("../controllers/user.controller");

const router = express.Router();

router.post("/validation", userController.validateIdController);
router.post("/register", userController.registerUserController);
router.patch("/register", userController.updateUserController);

// POST /user/login
router.post("/login", login);

// GET /user
router.get("/", getUserNickname);

module.exports = router;
