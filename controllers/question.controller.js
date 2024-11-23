const {
  getAllQuestions,
  getAllQuestionsByUserId,
  getQuestionByUserIdAndDate,
  getQuestionsInDecemberByUserId,
} = require("../repositories/question.repository");
const logger = require("../logger");
const { InvalidInputError } = require("../errors");
const { validDate } = require("../services/question.service");

const handleGetMainPageCalendarEvents = async (req, res) => {
  // TODO
  const result = await getAllQuestionsByUserId(req.user.user_id);
  logger.info(`Get all questions: ${JSON.stringify(result)}`);
  res.status(200).success(result);
};

const handleGetMessageByUserIdAndDate = async (req, res, next) => {
  const { date } = req.params;

  let formattedDate = "";
  const isValidDate = validDate(date, next);
  if (!isValidDate) {
    return;
  } else {
    formattedDate = isValidDate;
  }

  const result = await getQuestionByUserIdAndDate(
    req.user.user_id,
    formattedDate
  );
  logger.info(`Get question by user id and date: ${JSON.stringify(result)}`);
  res.status(200).success(result);
};

const handleGetUserQuestionStatusByUserId = async (req, res, next) => {
  const user_id = req.query.userid;
  if (!user_id) {
    logger.error(`User Id가 전달되지 않았음: ${user_id}`);
    next(new InvalidInputError("User Id가 전달되지 않았습니다."));
    return;
  }

  const result = await getQuestionsInDecemberByUserId(user_id);
  logger.info(
    `User_id에 따른 12월달의 이벤트를 모두 가져옵니다: ${result.length}`
  );
  const questionStatus = new Array(31).fill(0);
  result.map((q) => {
    const day = parseInt(q.assigned_date.split("-")[2], 10);
    questionStatus[day - 1] += 1;
  });

  res.status(200).success(questionStatus);
};

module.exports = {
  handleGetMainPageCalendarEvents,
  handleGetMessageByUserIdAndDate,
  handleGetUserQuestionStatusByUserId,
};
