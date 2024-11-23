const userRepository = require("../repositories/user.repository");
const { NotExistError, AlreadyExistError } = require("../errors");
const UserLoginRepository = require("../repositories/user.repository");
const UserRepository = require("../repositories/user.repository");
const bcrypt = require("bcrypt"); // bcrypt 사용

const validateId = async (loginId) => {
  //loginId를 DB에서 검색해 isValidate에 담음
  const isValidate = await userRepository.getUserByLoginId(loginId);

  //isValidate가 있다면 이미 있는 아이디
  if (isValidate) {
    throw new AlreadyExistError("이미 존재하는 아이디입니다");
  }
  //없다면 요청한 loginId를 리턴한다
  return loginId;
};
const registerUser = async (data) => {
  //data => {loginId,password}
  const existingUser = await userRepository.getUserByLoginId(data.loginId);

  if (existingUser) {
    //존재하는 유저라면
    throw new AlreadyExistError("이미 존재하는 아이디(이메일)입니다");
  }

  const hashedPassword = await bcrypt.hash(data.password, 3);

  //해싱된 비밀번호로 newUser 저장
  const newUser = {
    login_id: data.loginId,
    password: hashedPassword,
    color: null,
    nickname: null,
  };

  //존재하지 않는 유저라면 null ,존재한다면 그 user를 리턴함
  const registerUserId = await userRepository.addUser(newUser);

  const user = await userRepository.getUserById(registerUserId);
  //유저 등록후 user 검색,반환
  return user;
};

const updateUser = async (data) => {
  //data => {userId,color,nickname}
  const user = await userRepository.getUserById(data.userId);

  if (!user) {
    next(new NotExistError("존재하지 않는 유저입니다"));
  }
  const updatedUser = await userRepository.updateUser(data);

  return updatedUser;
};

const loginService = async (login_id, password) => {
  const user = await UserLoginRepository.findByLoginId(login_id);

  if (!user) {
    return null; // 사용자 없음
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return null; // 비밀번호 불일치
  }

  return user;
};

const getUserNicknameService = async (user_id) => {
  const user = await UserRepository.findNicknameById(user_id);
  return user;
};

module.exports = {
  validateId,
  registerUser,
  updateUser,
  loginService,
  getUserNicknameService,
};