const { getUserById } = require('../repositories/question.repository');
const { getQuestionById } = require('../repositories/question.repository');
const questionRepository = require('../repositories/question.repository');
const { NotExistError } = require('../error');

const addAnswer = async (question_id, questioned_user_id, content) => {
  

   // 질문 존재 여부 확인
   const existingQuestion = await getQuestionById(question_id);
   if (!existingQuestion) {
     throw new NotExistError("존재하지 않는 질문입니다.");
   }

  // 답변 생성
  const answer = await questionRepository.createAnswer(question_id, questioned_user_id, content);
  return answer;
};



const addQuestion = async (questioned_user_id, author_nickname, assigned_date, content) => {



  if(!getUserById(questioned_user_id)){
    throw new NotExistError("존재하지않는 사용자입니다.");
  }

  const questions =await questionRepository.createQuestion(questioned_user_id, author_nickname, assigned_date, content);

  return questions;
  
}



module.exports = { addAnswer, addQuestion };
