const UserRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt'); // bcrypt 사용

class UserService {
  static async login(login_id, password) {
    // login_id로 사용자 검색
    const user = await UserRepository.findByLoginId(login_id);

    if (!user) {
      return null; // 사용자 없음
    }

    // 입력된 비밀번호와 저장된 해시된 비밀번호 비교
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return null; // 비밀번호 불일치
    }

    // 로그인 성공 시 사용자 반환
    return user;
  }
}

module.exports = UserService;
