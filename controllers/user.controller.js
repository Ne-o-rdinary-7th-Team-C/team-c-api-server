const { loginService } = require('../services/user.service');
const { getUserNicknameService } = require('../services/user.service');
const { InvalidCredentialsError, InternalServerError } = require('../error'); // 에러 클래스 가져오기

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
};
