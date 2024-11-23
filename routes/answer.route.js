const express = require("express");
const multer = require("multer");
const answerController = require("../controllers/answer.controller");

const answerRouter = express.Router();
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

/**
 * @swagger
 * /answers/upload:
 *   post:
 *     summary: 이미지를 업로드합니다.
 *     tags:
 *       - Answers
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 파일 업로드 성공
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
 *                     message:
 *                       type: string
 *                     fileUrl:
 *                       type: string
 *                       format: uri
 *       400:
 *         description: 잘못된 파일 형식 또는 파일이 첨부되지 않음
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
answerRouter.post(
  "/upload",
  upload.single("file"),
  answerController.uploadImage
);

module.exports = answerRouter;
