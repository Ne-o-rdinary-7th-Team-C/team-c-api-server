const express = require("express");
const multer = require("multer");
const answerController = require("../controllers/answer.controller");

const answerRouter = express.Router();
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

answerRouter.post(
  "/upload",
  upload.single("file"),
  answerController.uploadImage
);

module.exports = answerRouter;
