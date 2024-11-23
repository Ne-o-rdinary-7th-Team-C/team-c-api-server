const express = require("express");
const {
  handleGetMainPageCalendarEvents,
  handleGetMessageByUserIdAndDate,
  handleGetUserQuestionStatusByUserId,
  handleAddAnswer,
  handleAddQuestion,
  handleGetUserQuestionAnswerByUserIdAndDate,
} = require("../controllers/question.controller");

const router = express.Router();

/**
 * @swagger
 * /questions:
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
 */
router.get("/", handleGetMainPageCalendarEvents);
/**
 * @swagger
 * /questions/view/user/{user_id}:
 *   get:
 *     summary: 특정 사용자의 12월 질문 상태를 조회합니다.
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
 */
router.get("/view/user/:user_id", handleGetUserQuestionStatusByUserId);

/**
 * @swagger
 * /questions/view/user/{user_id}/date/{date}:
 *   get:
 *     summary: 특정 사용자와 날짜에 대한 질문과 답변을 조회합니다.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 조회할 사용자 ID
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
 */
router.get(
  "/view/user/:user_id/date/:date",
  handleGetUserQuestionAnswerByUserIdAndDate
);

/**
 * @swagger
 * /questions/{date}:
 *   get:
 *     summary: 특정 날짜에 대한 질문을 조회합니다.
 *     tags:
 *       - Questions
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
 */
router.get("/:date", handleGetMessageByUserIdAndDate);

//답변 작성
/**
 * @swagger
 * /questions/{question_id}/answer:
 *   post:
 *     summary: 특정 질문에 대한 답변을 작성합니다.
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
 *         description: 답변을 작성할 질문의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "이것은 답변 내용입니다."
 *     responses:
 *       201:
 *         description: 답변 작성 성공
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
 *         description: 잘못된 입력 - 내용이 제공되지 않음
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
 */
router.post("/:question_id/answer", handleAddAnswer);

//질문 작성
/**
 * @swagger
 * /questions:
 *   post:
 *     summary: 새로운 질문을 작성합니다.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "이것은 질문 내용입니다."
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
 *                     content:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 잘못된 입력 - 내용이 제공되지 않음
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
 */
router.post("/", handleAddQuestion);

module.exports = router;
