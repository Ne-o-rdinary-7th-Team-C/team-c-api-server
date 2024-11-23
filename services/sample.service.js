const userRepository = require('../repositories/user.repository');

const getAllUsers = async () => {
    return await userRepository.findAll();
};

const createUser = async (userData) => {
    return await userRepository.create(userData);
};

const getUserById = async (id) => {
    return await userRepository.findById(id);
};

const updateUser = async (id, userData) => {
    return await userRepository.update(id, userData);
};

const deleteUser = async (id) => {
    return await userRepository.delete(id);
};

module.exports = { getAllUsers, createUser, getUserById, updateUser, deleteUser };
