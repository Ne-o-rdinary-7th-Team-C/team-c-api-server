const {
  validateId,
  registerUser,
  updateUser,
} = require("../services/user.service");

const { loginService } = require("../services/user.service");
const { getUserNicknameService } = require("../services/user.service");
const {
  InvalidCredentialsError,
  InternalServerError,
  LoginValidationError,
  UserNotFoundError,
} = require("../errors"); // 에러 클래스 가져오기

const logger = require("../logger");

//로그인 ID 중복 확인 컨트롤러
const validateIdController = async (req, res, next) => {
  logger.info("validateIdController 실행됨");

  const { loginId } = req.body;
  try {
    //response에는 요청한 loginId가 담긴다
    const response = await validateId(loginId);
    res.status(200).success(response);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//회원가입 컨트롤러
const registerUserController = async (req, res, next) => {
  logger.info("registerUserController 실행됨");

  const { loginId, password } = req.body;
  try {
    await validateId(loginId);
    //response에는 등록한 user가 담김
    const response = await registerUser({ loginId, password });
    res.status(200).success(response);
  } catch (error) {
    logger.error(`Internal Server Error: ${error}`);
    return next(error);
  }
};

//별명 및 색상 설정 컨트롤러
const updateUserController = async (req, res, next) => {
  console.log("updateUserController 실행됨");
  const userId = req.user.user_id;
  const { color, nickname } = req.body;
  try {
    //response에는 업데이트한 user가 담김
    // 한번에 repository 접근함 ; convention에 어긋나지만 일단 유지
    const response = await updateUser({ userId, color, nickname });
    res.status(200).success(response);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  const { login_id, password } = req.body;

  if (!login_id || !password) {
    // 로그인 ID 또는 비밀번호가 없을 경우
    return next(new LoginValidationError());
  }
  try {
    const user = await loginService(login_id, password);

    if (user) {
      return res.status(200).success(user);
    } else {
      return next(new InvalidCredentialsError());
    }
  } catch (error) {
    logger.error(`Internal Server Error: ${error}`);
    return next(new InternalServerError(error.message));
  }
};

const getUserNickname = async (req, res, next) => {
  try {
    let { user_id } = req.params;
    user_id = parseInt(user_id);
    if (!user_id) return next(new UserNotFoundError());

    const user = await getUserNicknameService(user_id);
    if (user) {
      return res.status(200).success(user);
    } else {
      return next(new UserNotFoundError());
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return next(new InternalServerError(error.message));
  }
};

module.exports = {
  login,
  getUserNickname,
  registerUserController,
  validateIdController,
  updateUserController,
};
