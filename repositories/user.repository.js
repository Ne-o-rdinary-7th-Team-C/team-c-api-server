const db = require('../models/database'); // 데이터베이스 연결 파일

const UserLoginRepository = {
  getUserByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?'; 
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  },//이메일을 검증하는 쿼리 
};



module.exports = UserLoginRepository;




