const bcrypt = require("bcrypt");
const userRepository = require("../repositories/user.repository");

const registerUser = async (data) => {
  //data => {loginId,password}
  const hashedPassword = await bcrypt.hash(data.password, 3);

  //해싱된 비밀번호로 newUser 저장
  const newUser = {
    login_id: data.loginId,
    password: hashedPassword,
    color: null,
    nickname: null,
  };

  //존재하지 않는 유저라면 null ,존재한다면 그 user를 리턴함
  const registerUserId = await userRepository.addUser(newUser);
  console.log("registerUserId", registerUserId);

  if (!registerUserId) {
    //존재하는 유저라면
    throw new Error("이미 존재하는 아이디(이메일)입니다");
  }

  const user = await userRepository.getUserById(registerUserId);
  //유저 등록후 user 검색,반환
  return user;
};

module.exports = registerUser;
