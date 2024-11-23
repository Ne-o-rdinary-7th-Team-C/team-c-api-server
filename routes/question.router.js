const express = require("express");
const {
  handleGetMainPageCalendarEvents,
} = require("../services/question.service");

const router = express.Router();

router.get("", handleGetMainPageCalendarEvents);

module.exports = router;
