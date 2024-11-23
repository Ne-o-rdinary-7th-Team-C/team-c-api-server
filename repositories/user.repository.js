const { User } = require("../models/index");

const addUser = async (newUser) => {
  const existingUser = await User.findOne({
    where: { login_id: newUser.login_id },
  });

  if (existingUser) {
    return null;
  }
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

module.exports = { addUser, getUserById };
