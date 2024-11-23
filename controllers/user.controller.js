const {
  validateId,
  registerUser,
  updateUser,
} = require("../services/user.service");

const { loginService } = require("../services/user.service");
const { getUserNicknameService } = require("../services/user.service");
const { InvalidCredentialsError, InternalServerError } = require("../errors"); // 에러 클래스 가져오기

//로그인 ID 중복 확인 컨트롤러
const validateIdController = async (req, res, next) => {
  console.log("validateIdController 실행됨");

  const { loginId } = req.body;
  try {
    //response에는 요청한 loginId가 담긴다
    const response = await validateId(loginId);
    res.status(200).success(response);
  } catch (error) {
    console.error(error);
    res.status(500).error(error);
  }
};

//회원가입 컨트롤러
const registerUserController = async (req, res, next) => {
  console.log("registerUserController 실행됨");

  const { loginId, password } = req.body;
  try {
    //response에는 등록한 user가 담김
    const response = await registerUser({ loginId, password });
    res.status(200).success(response);
  } catch (error) {
    console.error(error);
    res.status(500).error(error);
  }
};

//별명 및 색상 설정 컨트롤러
const updateUserController = async (req, res, next) => {
  console.log("updateUserController 실행됨");
  const userId = req.user.user_id;
  const { color, nickname } = req.body;
  try {
    //response에는 업데이트한 user가 담김
    const response = await updateUser({ userId, color, nickname });
    res.status(200).success(response);
  } catch (error) {
    console.error(error);
    res.status(500).error({ error: error });
  }
};

const login = async (req, res, next) => {
  const { login_id, password } = req.body;

  if (!login_id || !password) {
    return next(new LoginValidationError());
  }
  try {
    const user = await loginService(login_id, password);

    if (user) {
      return res.status(200).success({
        user_id: user.user_id,
        nickname: user.nickname,
        color: user.color,
      });
    } else {
      return next(new InvalidCredentialsError());
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return next(new InternalServerError(error.message));
  }
};

const getUserNickname = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id || 1;
    const user = await getUserNicknameService(user_id);

    if (user) {
      return res.status(200).success({
        nickname: user.nickname,
      });
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
