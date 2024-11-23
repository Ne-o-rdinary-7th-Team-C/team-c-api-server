const {
  findByLoginId,
  findNicknameById,
  addUser,
  getUserByLoginId,
  updateUser,
} = require("../repositories/user.repository");

const { AlreadyExistError } = require("../errors");

const bcrypt = require("bcrypt"); // bcrypt 사용
const { SALT_ROUNDS } = require("../config.json");

const validateId = async (loginId) => {
  // loginId를 DB에서 검색해 isValidate에 담음
  const isValidate = await getUserByLoginId(loginId);

  // isValidate가 있다면 이미 있는 아이디
  if (isValidate) {
    throw new AlreadyExistError("이미 존재하는 아이디입니다");
  }
  // 없다면 요청한 loginId를 리턴한다
  return loginId;
};
const registerUser = async (data) => {
  validateId(data.loginId); // 중복된 아이디가 있는지 확인

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  // 해싱된 비밀번호로 newUser 저장
  const newUser = {
    login_id: data.loginId,
    password: hashedPassword,
    color: null,
    nickname: null,
  };

  // 존재하지 않는 유저라면 null ,존재한다면 그 user를 리턴함
  const registerUserId = await addUser(newUser);
  // Refactor: create 시 반환값 그대로 사용
  return registerUserId;
};

const loginService = async (login_id, password) => {
  const user = await findByLoginId(login_id);

  if (!user) {
    return null; // 사용자 없음
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null; // 비밀번호 불일치
  }

  return user;
};

const getUserNicknameService = async (user_id) => {
  const user = await findNicknameById(user_id);
  return user;
};

module.exports = {
  validateId,
  registerUser,
  updateUser,
  loginService,
  getUserNicknameService,
};
