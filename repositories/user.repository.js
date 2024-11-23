const{User}= require('../models');


class UserRepository {
    // login_id로 사용자 검색
    static async findByLoginId(login_id) {
      return User.findOne({ where: { login_id } });
    }
  }
  
  module.exports = UserRepository; 