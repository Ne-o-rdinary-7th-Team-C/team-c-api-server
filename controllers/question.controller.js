const questionService = require('../services/question.service');

//7 답변 쓰기
const addAnswer = async (req, res) => {
    const { question_id } = req.params;
    const {questioned_user_id, content} = req.body; // 클라이언트로부터 답변 내용과 사용자 ID를 전달받음

    try {
        const answer = await questionService.addAnswer(question_id, questioned_user_id, content);
        res.status(201).json(answer);
    } catch (error) {
        console.log("addQuestion 서비스 오류")
        res.status(400).json({ error: error.message });
    }
};
//밥먹고와서 여기부터


//질문 작성
const addQuestion = async (req, res) => {
    const {questioned_user_id, author_nickname, assigned_date, content} = req.body;
    

    try{
        const question = await questionService.addQuestion(questioned_user_id, author_nickname, assigned_date, content);
        res.status(201).json(question);

    }catch(error){
        //에러핸들링
        
    }
}

module.exports = { addAnswer, addQuestion };
