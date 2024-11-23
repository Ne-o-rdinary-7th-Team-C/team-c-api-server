// const handleGetMainPageCalendarEvents = async (req, res) => {
//   // TODO
// };

// module.exports = { handleGetMainPageCalendarEvents };

const { getUserById } = require("../repositories/question.repository");
const { getQuestionById } = require("../repositories/question.repository");
const questionRepository = require("../repositories/question.repository");
const { InvalidInputError } = require("../errors");
const logger = require("../logger");

const validDate = (date, next) => {
  const dateRegex = /^(19|20)\d\d(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
  if (!dateRegex.test(date)) {
    logger.error(`Invalid date format: ${date}`);
    next(new InvalidInputError("올바른 날짜 형식이 아닙니다."));
    return false;
  }

  // YYYYMMDD 형식을 YYYY/MM/DD로 변환
  let formattedDate = `${date.substring(0, 4)}/${date.substring(
    4,
    6
  )}/${date.substring(6, 8)}`;

  // 한국 표준시(KST) 기반으로 날짜 포맷팅
  formattedDate = new Date(formattedDate)
    .toLocaleDateString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, "")
    .replace(/ /g, "-");

  // 추가적인 유효성 검사 (필요시)
  const isValidDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    return (
      dateObj.getFullYear() === year &&
      dateObj.getMonth() + 1 === month &&
      dateObj.getDate() === day
    );
  };

  if (!isValidDate(formattedDate)) {
    logger.error(`Invalid date: ${formattedDate}`);
    next(new InvalidInputError("유효하지 않은 날짜입니다."));
    return false;
  }

  return formattedDate;
};

const addAnswerService = async (question_id, questioned_user_id, content) => {
  // 비즈니스 로직 추가 가능 (예: 유효성 검사)

  if (!getQuestionById(question_id)) {
    throw new Error("존재하지않는 질문입니다.");
  }

  const answer = await questionRepository.createAnswer(
    question_id,
    questioned_user_id,
    content
  );

  return answer;
};

const addQuestionService = async (
  questioned_user_id,
  author_nickname,
  assigned_date,
  content
) => {
  if (!getUserById(questioned_user_id)) {
    throw new Error("존재하지않는 사용자입니다.");
  }

  const questions = await questionRepository.createQuestion(
    questioned_user_id,
    author_nickname,
    assigned_date,
    content
  );

  return questions;
};

module.exports = {
  validDate,
  addAnswerService,
  addQuestionService,
};
