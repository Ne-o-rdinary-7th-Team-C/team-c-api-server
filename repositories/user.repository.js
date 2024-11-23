const { User } = require('../models');

const findByLoginId = async (login_id) => {
    return User.findOne({ where: { login_id } });
};

const findNicknameById = async (userId) => {
    return User.findOne({ where: { user_id: userId }, attributes: ['nickname'] });
};

module.exports = {
    findByLoginId,
    findNicknameById,
};
