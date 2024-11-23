const express = require("express");
const {
  login,
  getUserNickname,
  registerUserController,
  validateIdController,
  updateUserController,
} = require("../controllers/user.controller");

const router = express.Router();

// id 중복여부 확인
router.post("/validation", validateIdController);

// 1차 회원가입 : id, password 요구합니다
router.post("/register", registerUserController);
// 2차 회원가입 : 별명을 요구합니다
router.patch("/register", updateUserController);

// 사용자 로그인 입니다.
router.post("/login", login);

// 사용자 닉네임을 return 합니다.
router.get("/:user_id", getUserNickname);

module.exports = router;
