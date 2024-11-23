const { validateId, registerUser } = require("../services/user.service");

const validateIdController = async (req, res) => {
  console.log("validateIdController 실행됨");

  const { loginId } = req.body;
  try {
    //response에는 요청한 loginId가 담긴다
    const response = await validateId(loginId);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

const registerUserController = async (req, res) => {
  console.log("registerUserController 실행됨");

  const { loginId, password } = req.body;
  try {
    //response에는 등록한 user가 담김
    const response = await registerUser({ loginId, password });
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

module.exports = { registerUserController, validateIdController };
