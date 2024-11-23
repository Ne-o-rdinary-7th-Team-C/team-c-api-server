const express = require("express");
const questionController = require("../controllers/question.controller")


const router = express.Router();

//답변 작성
router.post("/:question_id/answer", questionController.addAnswer);

//질문 작성 
router.post("/", questionController.addQuestion);





module.exports = router;
