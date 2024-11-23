const User = require('../models/user');

const findAll = async () => {
    return await User.findAll();
};

const create = async (userData) => {
    return await User.create(userData);
};

const findById = async (id) => {
    return await User.findByPk(id);
};

const update = async (id, userData) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(userData);
};

const deleteUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return true;
};

module.exports = { findAll, create, findById, update, delete: deleteUser };
