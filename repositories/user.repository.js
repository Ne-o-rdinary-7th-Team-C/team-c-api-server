const { User } = require("../models/index");

const addUser = async (newUser) => {
  const createdUser = await User.create(newUser);

  return createdUser.user_id;
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    return null;
  }

  return user;
};

const getUserByLoginId = async (id) => {
  const existingUser = await User.findOne({
    where: { login_id: id },
  });

  return existingUser;
};

const updateUser = async (data) => {
  //data => userId, color ,nickname
  const { userId, color, nickname } = data;

  await User.update({ color, nickname }, { where: { user_id: userId } });

  const updatedUser = await User.findOne({
    where: { user_id: userId },
    attributes: { exclude: ["password"] },
  });

  return updatedUser;
};

module.exports = { addUser, getUserById, getUserByLoginId, updateUser };
