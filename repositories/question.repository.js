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

module.exports = { getAllQuestions, getAllQuestionsByUserId };
