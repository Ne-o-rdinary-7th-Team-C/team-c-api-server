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

/**
 * @swagger
 * /questions/calendar-events:
 *   get:
 *     summary: 메인 페이지 캘린더 이벤트를 가져옵니다.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 캘린더 이벤트 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       question_id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       assigned_date:
 *                         type: string
 *                         format: date
 *       401:
 *         description: 인증 오류 - 토큰이 없거나 만료됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                     reason:
 *                       type: string
 *       500:
 *         description: 서버 오류
 */
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

/**
 * @swagger
 * /questions/{date}:
 *   get:
 *     summary: 사용자 ID와 날짜에 해당하는 질문을 조회합니다.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: 조회할 날짜 (YYYY-MM-DD 형식)
 *     responses:
 *       200:
 *         description: 질문 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                     content:
 *                       type: string
 *                     assigned_date:
 *                       type: string
 *                       format: date
 *       400:
 *         description: 잘못된 날짜 형식
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                     reason:
 *                       type: string
 *       401:
 *         description: 인증 오류 - 토큰이 없거나 만료됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                     reason:
 *                       type: string
 *       500:
 *         description: 서버 오류
 */
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

/**
 * @swagger
 * /questions/user/{user_id}/status:
 *   get:
 *     summary: 사용자 ID에 따른 12월의 질문 상태를 조회합니다.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 조회할 사용자 ID
 *     responses:
 *       200:
 *         description: 질문 상태 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: integer
 *                     description: 각 날짜별 질문 수 (1일부터 31일까지)
 *       400:
 *         description: 사용자 ID가 전달되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                     reason:
 *                       type: string
 *       500:
 *         description: 서버 오류
 */
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

/**
 * @swagger
 * /questions/{user_id}/{date}/answers:
 *   get:
 *     summary: 사용자 ID와 날짜에 따른 질문과 답변을 조회합니다.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 사용자 ID
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: 조회할 날짜 (YYYY-MM-DD 형식)
 *     responses:
 *       200:
 *         description: 질문과 답변 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: object
 *                       properties:
 *                         question_id:
 *                           type: integer
 *                         content:
 *                           type: string
 *                     answers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           answer_id:
 *                             type: integer
 *                           content:
 *                             type: string
 *       400:
 *         description: 사용자 ID 또는 날짜가 입력되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                     reason:
 *                       type: string
 *       500:
 *         description: 서버 오류
 */
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
/**
 * @swagger
 * /questions/{question_id}/answers:
 *   post:
 *     summary: 특정 질문에 대한 답변을 추가합니다.
 *     tags:
 *       - Answers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: question_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 답변을 추가할 질문의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 답변 내용
 *     responses:
 *       201:
 *         description: 답변 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     answer_id:
 *                       type: integer
 *                     question_id:
 *                       type: integer
 *                     content:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 질문 ID 또는 답변 내용이 전달되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                     reason:
 *                       type: string
 *       401:
 *         description: 인증 오류 - 토큰이 없거나 만료됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                     reason:
 *                       type: string
 *       500:
 *         description: 서버 오류
 */
const handleAddAnswer = async (req, res, next) => {
  if (!req.user) {
    next(new UnauthorizedError("토큰이 없거나 만료되었습니다"));
    return;
  }
  const { question_id } = req.params;
  const { content } = req.body; // 클라이언트로부터 답변 내용과 사용자 ID를 전달받음
  const questioned_user_id = req.user.user_id; // 현재 로그인한 사용자의 ID

  if (!question_id || !content) {
    next(new InvalidInputError("질문 아이디와 내용이 전달되지 않았습니다 "));
    return;
  }
  console
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
/**
 * @swagger
 * /questions:
 *   post:
 *     summary: 새로운 질문을 작성합니다.
 *     tags:
 *       - Questions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questioned_user_id:
 *                 type: integer
 *                 description: 질문을 받을 사용자 ID
 *               author_nickname:
 *                 type: string
 *                 description: 질문 작성자의 닉네임
 *               assigned_date:
 *                 type: string
 *                 format: date
 *                 description: 질문이 할당될 날짜 (YYYY-MM-DD 형식)
 *               content:
 *                 type: string
 *                 description: 질문 내용
 *     responses:
 *       201:
 *         description: 질문 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                     questioned_user_id:
 *                       type: integer
 *                     author_nickname:
 *                       type: string
 *                     assigned_date:
 *                       type: string
 *                       format: date
 *                     content:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 필요한 값이 입력되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                     reason:
 *                       type: string
 *       500:
 *         description: 서버 오류
 */
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
