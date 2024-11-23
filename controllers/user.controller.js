const UserLoginService = require('../services/user.service');

const UseLoginController = {
  login: async (req, res) => {
    const { login_id, password } = req.body;

    try {
      const response = await UserService.login(login_id, password); // 로그인 아이디와 패스워드 
      res.status(200).json(response);
    } catch (error) {
      res.status(401).json({ message: error.message });//에러 메세지 출력 
    }
  },
};

module.exports = UserLoginController;
