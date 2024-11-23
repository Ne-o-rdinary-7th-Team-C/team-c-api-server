const {
  getQuestionByUserIdAndDate,
  getQuestionsInDecemberByUserId,
} = require("../repositories/question.repository");
const logger = require("../logger");
const { InvalidInputError, UnauthorizedError } = require("../errors");
const {
  validDate,
  addAnswerService,
  addQuestionService,
  getQuestionAndAnswerService,
} = require("../services/question.service");

const handleGetMainPageCalendarEvents = async (req, res, next) => {
  if (!req.user) {
    next(new UnauthorizedError("토큰이 없거나 만료되었습니다"));
    return;
  }
  // TODO
  const result = await getQuestionsInDecemberByUserId(req.user.user_id);
  logger.info(`Get all questions: ${JSON.stringify(result)}`);
  res.status(200).success(result);
};

const handleGetMessageByUserIdAndDate = async (req, res, next) => {
  if (!req.user) {
    next(new UnauthorizedError("토큰이 없거나 만료되었습니다"));
    return;
  }
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
  const { user_id } = req.params;
  if (!user_id) {
    logger.error(`User Id가 전달되지 않았음: ${user_id}`);
    next(new InvalidInputError("User Id가 전달되지 않았습니다."));
    return;
  }

  const result = await getQuestionsInDecemberByUserId(user_id);
  logger.info(
    `User_id에 따른 12월달의 이벤트를 모두 가져옵니다: ${result.length}개`
  );
  const questionStatus = new Array(31).fill(0);
  result.map((q) => {
    const day = parseInt(q.assigned_date.split("-")[2], 10);
    questionStatus[day - 1] += 1;
  });

  res.status(200).success(questionStatus);
};

const handleGetUserQuestionAnswerByUserIdAndDate = async (req, res, next) => {
  try {
    const { user_id, date } = req.params;
    if (!user_id || !date) {
      next(new InvalidInputError("아이디와 날짜가 입력되지 않았습니다"));
      return;
    }

    const result = await getQuestionAndAnswerService(user_id, date, next);

    res.status(200).success(result);
  } catch (error) {
    console.error(error);
    res.status(500).error(error);
  }
};

//7 답변 쓰기
const handleAddAnswer = async (req, res, next) => {
  if (!req.user) {
    next(new UnauthorizedError("토큰이 없거나 만료되었습니다"));
    return;
  }
  const { question_id } = req.params;
  const { content } = req.body; // 클라이언트로부터 답변 내용과 사용자 ID를 전달받음
  const questioned_user_id = req.user.user_id; // 현재 로그인한 사용자의 ID

  if (!question_id || content) {
    next(new InvalidInputError("질문 아이디와 내용이 전달되지 않았습니다 "));
    return;
  }
  try {
    const answer = await addAnswerService(
      question_id,
      questioned_user_id,
      content
    );
    res.status(201).success(answer);
  } catch (error) {
    logger.error(`Error: ${error}`);
    next(error);
  }
};

//질문 작성
const handleAddQuestion = async (req, res, next) => {
  const { questioned_user_id, author_nickname, assigned_date, content } =
    req.body;
  if (!questioned_user_id || !author_nickname || !assigned_date || !content) {
    next(new InvalidInputError("필요한 값이 입력되지 않았습니다"));
    return;
  }
  try {
    const question = await addQuestionService(
      questioned_user_id,
      author_nickname,
      assigned_date,
      content
    );
    res.status(201).success(question);
  } catch (error) {
    //에러핸들링
    logger.error(`Error: ${error}`);
    next(error);
  }
};

module.exports = {
  handleGetMainPageCalendarEvents,
  handleGetMessageByUserIdAndDate,
  handleGetUserQuestionStatusByUserId,
  handleAddAnswer,
  handleAddQuestion,
  handleGetUserQuestionAnswerByUserIdAndDate,
};
