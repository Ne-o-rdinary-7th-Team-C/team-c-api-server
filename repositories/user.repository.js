const { User } = require('../models');

class UserLoginRepository {
    // login_id로 사용자 검색
    static async findByLoginId(login_id) {
        return User.findOne({ where: { login_id } });
    }
}

class UserRepository {
    // user_id로 유저 정보 조회
    static async findById(userId) {
        return User.findOne({ where: { user_id: userId } });
    }
}

// 여러 클래스를 하나의 객체로 내보냅니다.
module.exports = {
    UserLoginRepository,
    UserRepository
};
