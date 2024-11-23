const express = require("express");
const {
  handleGetMainPageCalendarEvents,
} = require("../services/question.service");

const router = express.Router();

router.get("", handleGetMainPageCalendarEvents);
router.get();

module.exports = router;
