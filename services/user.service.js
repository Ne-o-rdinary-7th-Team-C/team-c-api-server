const UserLoginRepository = require('../repositories/user.repository');
const UserRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt'); // bcrypt 사용

const loginService = async (login_id, password) => {
    const user = await UserLoginRepository.findByLoginId(login_id);

    if (!user) {
        return null; // 사용자 없음
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
        return null; // 비밀번호 불일치
    }

    return user;
};

const getUserNicknameService = async (user_id) => {
    const user = await UserRepository.findNicknameById(user_id);
    return user;
};

module.exports = {
    loginService,
    getUserNicknameService,
};
