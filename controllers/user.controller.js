const {
  validateId,
  registerUser,
  updateUser,
} = require("../services/user.service");

const { loginService } = require("../services/user.service");
const { getUserNicknameService } = require("../services/user.service");
const {
  InternalServerError,
  UserNotFoundError,
  InvalidInputError,
  UnauthorizedError,
} = require("../errors"); // 에러 클래스 가져오기

const logger = require("../logger");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config.json");

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
    const token = jwt.sign(
      {
        user_id: response.user_id,
        nickname: response.nickname,
        iat: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365, // 1 year in seconds
      },
      JWT_SECRET
    );
    const user = { ...response.dataValues, token };
    res.status(200).success(user);
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

  logger.info(`로그인 요청: ${login_id}`);

  if (!login_id || !password) {
    // 로그인 ID 또는 비밀번호가 없을 경우
    return next(new InvalidInputError("로그인 ID 또는 비밀번호가 없습니다."));
  }
  try {
    const user = await loginService(login_id, password);

    if (user) {
      const token = jwt.sign(
        {
          user_id: user.user_id,
          nickname: user.nickname,
          iat: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365, // 1 year in seconds
        },
        JWT_SECRET
      );

      logger.info(`로그인 성공: ${login_id} ${user.nickname} ${token}`);

      const response = { ...user.dataValues, token };
      logger.info(`User: ${JSON.stringify(user, null, 2)}`);
      return res.status(200).success(response);
    } else {
      return next(
        new UnauthorizedError("로그인 ID 또는 비밀번호가 틀렸습니다.")
      );
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
    if (!user_id) return next(new InvalidInputError("잘못된 요청입니다."));

    const user = await getUserNicknameService(user_id);
    if (user) {
      return res.status(200).success(user);
    } else {
      return next(new UserNotFoundError("사용자를 찾을 수 없습니다."));
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
