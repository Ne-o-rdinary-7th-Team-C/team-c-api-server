const db = require("../models");

const { Question } = db;
const { Op } = require("sequelize");

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

module.exports = {
  getAllQuestions,
  getAllQuestionsByUserId,
  getQuestionByUserIdAndDate,
  getQuestionsInDecemberByUserId,
};
