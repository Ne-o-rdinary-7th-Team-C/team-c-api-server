const UserLoginService = require('../services/user.service');

const UserLoginController = {
  login: async (req, res) => {
    const { login_id, password } = req.body;

    try {
      const response = await UserLoginService.login(login_id, password);

      // 로그인 성공 응답
      res.status(200).json({
        resultType: "SUCCESS",
        error: null,
        success: {
          message: "Login successful",
          userId: response.userId, // 로그인된 사용자 ID
          nickname: response.nickname, // 닉네임
          token: response.token, // JWT 토큰
        },
      });
    } catch (error) {
      // 로그인 실패 응답
      res.status(401).json({
        resultType: "FAIL",
        error: {
          errorCode: "A100", // 로그인 실패 오류 코드
          reason: error.message, // 오류 원인
          data: {
            login_id: login_id, // 시도된 로그인 ID (보안상의 이유로 조심스럽게 사용)
          },
        },
        success: null,
      });
    }
  },
};

module.exports = UserLoginController;
