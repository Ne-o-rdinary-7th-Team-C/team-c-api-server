const { loginService } = require('../services/user.service');
const { getUserNicknameService } = require('../services/user.service');

const login = async (req, res) => {
    console.log("Request body:", req.body); // 요청 바디를 출력
    const { login_id, password } = req.body;

    if (!login_id || !password) {
        return res.status(400).json({
            resultType: "FAIL",
            error: {
                errorCode: "A400",
                reason: "로그인 혹은 패스워드가 잘못되었습니다",
                data: {},
            },
            success: null,
        });
    }

    try {
        const user = await loginService(login_id, password);

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
};

const getUserNickname = async (req, res) => {
    try {
        const user_id = req.user?.user_id || 1; // 기본값 설정
        console.log("Debug: user_id is", user_id); // 디버깅 로그

        const user = await getUserNicknameService(user_id);
        console.log("Debug: user data is", user); // 디버깅 로그

        if (user) {
            res.json({
                resultType: "SUCCESS",
                error: null,
                success: {
                    nickname: user.nickname,
                },
            });
        } else {
            res.status(404).json({
                resultType: "FAIL",
                error: {
                    errorCode: "A404",
                    reason: "User not found",
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
};

module.exports = {
    login,
    getUserNickname,
};
