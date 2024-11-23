const {
  getAllQuestions,
  getAllQuestionsByUserId,
} = require("../repositories/question.repository");
const logger = require("../logger");

const handleGetMainPageCalendarEvents = async (req, res) => {
  // TODO
  console.log("dsafasdfasdf", req.token);
  const result = await getAllQuestionsByUserId(req.user.user_id);
  logger.info(`Get all questions: ${JSON.stringify(result)}`);
  res.status(200).json(result);
};

module.exports = { handleGetMainPageCalendarEvents };
