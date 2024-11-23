const { User } = require("../models/index");

const addUser = async (newUser) => {
  const createdUser = await User.create(newUser);

  return createdUser;
};

// const getUserById = async (id) => {
//   const user = await User.findByPk(id, {
//     attributes: { exclude: ["password"] },
//   });

//   if (!user) {
//     return null;
//   }

//   return user;
// };
// 안쓰는 함수

const getUserByLoginId = async (id) => {
  const existingUser = await User.findOne({
    where: { login_id: id },
  });

  return existingUser;
};

const updateUser = async (data) => {
  //data => userId, color ,nickname
  const { userId, color, nickname } = data;

  const [affectedCount, affectedRows] = await User.update(
    { color, nickname },
    { where: { user_id: userId } }
  );

  // 영향을 받은 행의 수를 리턴
  return affectedCount;
};

const findByLoginId = async (login_id) => {
  return User.findOne({ where: { login_id } });
};

const findNicknameById = async (userId) => {
  return User.findOne({ where: { user_id: userId }, attributes: ["nickname"] });
};

module.exports = {
  findByLoginId,
  findNicknameById,
  addUser,
  getUserByLoginId,
  updateUser,
};
