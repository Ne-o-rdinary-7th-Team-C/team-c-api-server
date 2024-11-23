const {
  validateId,
  registerUser,
  updateUser,
} = require("../services/user.service");

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

module.exports = {
  registerUserController,
  validateIdController,
  updateUserController,
};
