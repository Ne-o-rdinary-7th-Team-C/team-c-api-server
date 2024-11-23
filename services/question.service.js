// const handleGetMainPageCalendarEvents = async (req, res) => {
//   // TODO
// };

// module.exports = { handleGetMainPageCalendarEvents };

const { getQuestionById } = require('../repositories/question.repository');
const questionRepository = require('../repositories/question.repository');

const addAnswer = async (question_id, questioned_user_id, content) => {
    // 비즈니스 로직 추가 가능 (예: 유효성 검사)

    if(!getQuestionById(questioned_id)){
      throw new Error("존재하지않는 질문입니다.");
    }


    return await questionRepository.createAnswer(question_id, questioned_user_id, content);
};


const addQuestion = async (questioned_user_id, author_nickname, assigned_date, content) => {

  try{
  return await questionRepository.createQuestion(questioned_user_id, author_nickname, assigned_date, content);
  }
  catch{
    
  }
}



module.exports = { addAnswer, addQuestion };
