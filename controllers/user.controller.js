const registerUser = require("../services/user.service");

const registerUserController = async (req, res) => {
  console.log("registerUser 실행됨");

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

module.exports = registerUserController;
