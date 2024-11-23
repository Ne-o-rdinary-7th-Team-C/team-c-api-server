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

router.get("/", handleGetMainPageCalendarEvents);
router.get("/view/user/:user_id", handleGetUserQuestionStatusByUserId);
router.get(
  "/view/user/:user_id/date/:date",
  handleGetUserQuestionAnswerByUserIdAndDate
);
router.get("/:date", handleGetMessageByUserIdAndDate);

//답변 작성
router.post("/:question_id/answer", handleAddAnswer);
//질문 작성
router.post("/", handleAddQuestion);

module.exports = router;
