const db = require("../models");

const { Question, Answer, User } = db;
const { Op, where } = require("sequelize");

const getAllQuestions = async () => {
  const result = await Question.findAll();
  return result;
};

const getAllQuestionsByUserId = async (userId) => {
  const result = await Question.findAll({
    where: {
      questioned_user_id: userId,
    },
  });
  return result;
};

const getQuestionByUserIdAndDate = async (userId, date) => {
  const result = await Question.findAll({
    where: {
      questioned_user_id: userId,
      assigned_date: date,
    },
    raw: true,
  });
  return result;
};

const getQuestionsInDecemberByUserId = async (userId) => {
  const result = await Question.findAll({
    where: {
      questioned_user_id: userId,
      assigned_date: {
        [Op.between]: ["2021-12-01", "2021-12-31"],
      },
    },
  });
  return result;
};

// 질문 생성
const createAnswer = async (question_id, questioned_user_id, content) => {
  return await Answer.create({
    question_id,
    content,
  });
};

const createQuestion = async (
  questioned_user_id,
  author_nickname,
  assigned_date,
  content
) => {
  return await Question.create({
    questioned_user_id,
    author_nickname,
    assigned_date,
    content,
  });
};

const getQuestionById = async (id) => {
  const existingQuestion = await Question.findByPk(id);

  return existingQuestion;
};

const getUserById = async (id) => {
  const existingUser = await User.findByPk(id);

  return existingUser;
};

module.exports = {
  getAllQuestions,
  getAllQuestionsByUserId,
  getQuestionByUserIdAndDate,
  getQuestionsInDecemberByUserId,
  createAnswer,
  createQuestion,
  getQuestionById,
  getUserById,
};
