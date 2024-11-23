const {
  getAllQuestions,
  getAllQuestionsByUserId,
  getQuestionByUserIdAndDate,
} = require("../repositories/question.repository");
const logger = require("../logger");

const handleGetMainPageCalendarEvents = async (req, res) => {
  // TODO
  const result = await getAllQuestionsByUserId(req.user.user_id);
  logger.info(`Get all questions: ${JSON.stringify(result)}`);
  res.status(200).json(result);
};

const handleGetMessageByUserIdAndDate = async (req, res) => {
  // TODO
  const date = req.query.date;
  const formattedDate = new Date(date).toISOString().split("T")[0];
  const result = await getQuestionByUserIdAndDate(
    req.user.user_id,
    formattedDate
  );
  logger.info(`Get question by user id and date: ${JSON.stringify(result)}`);
  res.status(200).json(result);
};

module.exports = { handleGetMainPageCalendarEvents };
