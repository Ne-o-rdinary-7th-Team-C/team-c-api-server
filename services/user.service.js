const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserLoginRepository = require('../repositories/user.repository');


const UserLoginService = {
  login: async (email, password) => {
    const user = await UserLoginRepository.getUserByEmail(email);

    if (!user) {
      throw new Error('이용자를 찾을 수 없습니다'); 
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);//해싱 

    if (!isPasswordValid) {
      throw new Error('맞지 않는 비밀번호 입니다');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', {
      expiresIn: '1h',// 세션 만료
    });

    return { message: '로그인 성공', token };//로그인 완료 
  },
};


module.exports = UserLoginService;
