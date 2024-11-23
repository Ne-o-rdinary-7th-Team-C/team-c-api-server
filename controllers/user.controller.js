const UserLoginService = require('../services/user.service');
const UserGetService = require('../services/user.service');

class UserLoginController {
    static async login(req, res) {
      console.log("Request body:", req.body); // 요청 바디를 출력
      const { login_id, password } = req.body;
  
      if (!login_id || !password) {
        return res.status(400).json({
          resultType: "FAIL",
          error: {
            errorCode: "A400",
            reason: "login_id and password are required",
            data: {},
          },
          success: null,
        });
      }
  
      try {
        const user = await UserLoginService.login(login_id, password);
  
        if (user) {
          res.json({
            resultType: "SUCCESS",
            error: null,
            success: {
              user_id: user.user_id,
              nickname: user.nickname,
              color: user.color,
            },
          });
        } else {
          res.status(401).json({
            resultType: "FAIL",
            error: {
              errorCode: "A100",
              reason: "Invalid credentials",
              data: {},
            },
            success: null,
          });
        }
      } catch (error) {
        console.error("Internal Server Error:", error); // 에러 로그 출력
        res.status(500).json({
          resultType: "FAIL",
          error: {
            errorCode: "A500",
            reason: "Internal Server Error",
            data: { message: error.message },
          },
          success: null,
        });
      }
    }
}









  
module.exports = UserLoginController;


