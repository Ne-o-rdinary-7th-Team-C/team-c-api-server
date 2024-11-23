const db = require("../models");

const { Question } = db;

const getAllQuestions = async () => {
  const result = await Question.findAll();
  return result;
};

module.exports = { getAllQuestions };
