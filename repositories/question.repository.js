const { Question, Answer, User } = require('../models');


// 질문 생성
const createAnswer = async (question_id, questioned_user_id, content) => {
    return await Answer.create({
        question_id,
        content,

    });
};


const createQuestion = async (questioned_user_id, author_nickname, assigned_date, content) => {
    return await Question.create({
        questioned_user_id,
        author_nickname,
        assigned_date,
        content,

    })
}

const getQuestionById = async (id) => {
    const existingQuestion = await Question.findByPk(id);
    
    return existingQuestion;
}

const getUserById = async (id) => {
    const existingUser = await User.findByPk(id);

    return existingUser;
}

module.exports = { createAnswer, createQuestion, getQuestionById, getUserById };
