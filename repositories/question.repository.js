const db = require("../models");

const { Question } = db;

const getAllQuestions = async () => {
  const result = await Question.findAll();
  return result;
};

const getAllQuestionsByUserId = async (userId) => {
  const result = await Question.findAll({
    where: {
      user_id: userId,
    },
  });
  return result;
};

const getQuestionByUserIdAndDate = async (userId, date) => {
  const result = await Question.findOne({
    where: {
      user_id: userId,
      assigned_date: date,
    },
  });
  return result;
};

module.exports = {
  getAllQuestions,
  getAllQuestionsByUserId,
  getQuestionByUserIdAndDate,
};
