const db = require("../models");

const { Question, Answer, User } = db;
const { Op, where } = require("sequelize");

const getAnswerByQuestionId = async (question_id) => {
  const answers = await Answer.findAll({
    where: { question_id: question_id },
    raw: true,
  });

  return answers;
};

module.exports = { getAnswerByQuestionId };
