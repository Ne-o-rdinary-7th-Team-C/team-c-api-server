const db = require("../models");

const { Question, Answer, User } = db;
const { Op, where } = require("sequelize");

const axios = require("axios");
const { API_KEY } = require("../config.json");
const { InvalidInputError } = require("../errors");
const getAllQuestions = async () => {
  const result = await Question.findAll();
  return result;
};

const getAllQuestionsByUserId = async (userId) => {
  const result = await Question.findAll({
    where: {
      questioned_user_id: userId,
    },
  });
  return result;
};

const getQuestionByUserIdAndDate = async (userId, date) => {
  const result = await Question.findAll({
    where: {
      questioned_user_id: userId,
      assigned_date: date,
    },
    raw: true,
  });

  if (result.length === 0) {
    const AIResult = createAiQuestion(date);

    return AIResult;
  } else {
    return result;
  }
};

const getQuestionsInDecemberByUserId = async (userId) => {
  const result = await Question.findAll({
    where: {
      questioned_user_id: userId,
      assigned_date: {
        [Op.between]: ["2024-11-01", "2024-12-31"], // 날짜 DB에 맞게 수정
      },
    },
  });
  return result;
};

// 질문 생성
const createAnswer = async (question_id, questioned_user_id, content) => {
  return await Answer.create({
    question_id,
    content,
  });
};

const createAiQuestion = async (assigned_date) => {
  const apiKey = API_KEY;
  const prompt = "질문 만들어줘";
  if (!apiKey) {
    throw new InvalidInputError("GPT API 값이 입력되지 않았습니다");
  }
  const messages = [
    {
      role: "system",
      content: `너는 연말 질문 남기는 AI야, 
      연말 느낌 나는 질문을 해줘 뻔하지않게 다른 말은 하지말고 딱 질문 하나만 보내 ,존댓말로 답해`, // gpt에게 시킬 것(역할 부여)
    },
    {
      role: "user",
      content: `${prompt}`,
    },
  ];

  const result = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o", //gpt 모델 설정
      temperature: 1, //대답 창의성 (0~1)
      messages: messages,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return await Question.create({
    questioned_user_id: 9999, //AI 회원가입시 ID 하드코딩
    author_nickname: "AI",
    assigned_date,
    content: result.data.choices[0].message.content,
  });
};

const createQuestion = async (
  questioned_user_id,
  author_nickname,
  assigned_date,
  content
) => {
  return await Question.create({
    questioned_user_id,
    author_nickname,
    assigned_date,
    content,
  });
};

const getQuestionById = async (id) => {
  const existingQuestion = await Question.findByPk(id);

  return existingQuestion;
};

const getUserById = async (id) => {
  const existingUser = await User.findByPk(id);

  return existingUser;
};

module.exports = {
  getAllQuestions,
  getAllQuestionsByUserId,
  getQuestionByUserIdAndDate,
  getQuestionsInDecemberByUserId,
  createAnswer,
  createQuestion,
  getQuestionById,
  getUserById,
};
