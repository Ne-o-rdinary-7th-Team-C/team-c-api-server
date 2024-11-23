const express = require("express");
const {
  handleGetMainPageCalendarEvents,
  handleGetMessageByUserIdAndDate,
  handleGetUserQuestionStatusByUserId,
} = require("../controllers/question.controller");

const router = express.Router();

router.get("/", handleGetMainPageCalendarEvents);
router.get("/view/user/:user_id", handleGetUserQuestionStatusByUserId);
router.get("/view/user/:user_id/date/:date");
router.get("/:date", handleGetMessageByUserIdAndDate);

module.exports = router;
