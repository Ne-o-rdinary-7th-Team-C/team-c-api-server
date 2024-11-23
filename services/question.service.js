const { getAllQuestions } = require("../repositories/question.repository");

const handleGetMainPageCalendarEvents = async (req, res) => {
  // TODO
  const result = getAllQuestions();
  logger.info(`Get all questions: ${JSON.stringify(result)}`);
  res.status(200).json(result);
};

module.exports = { handleGetMainPageCalendarEvents };
