const questionService = require('../services/question.service');

const addAnswer = async (req, res) => {
    const { question_id } = req.params;
    const { questioned_user_id, content } = req.body;

    try {
        const answer = await questionService.addAnswer(question_id, questioned_user_id, content);
        // 성공 응답
        res.success(answer);
    } catch (error) {
        console.error("Error in addAnswer:", error);
        // 에러 응답
        res.error({ reason: error.message });
    }
};

//밥먹고와서 여기부터


// 질문 작성
const addQuestion = async (req, res) => {
    const { questioned_user_id, author_nickname, assigned_date, content } = req.body;

    try {
        const question = await questionService.addQuestion(questioned_user_id, author_nickname, assigned_date, content);
        // 성공 응답
        res.success(question);
    } catch (error) {
        console.error("Error in addQuestion:", error);
        // 실패 응답
        res.error({ reason: error.message });
    }
};


module.exports = { addAnswer, addQuestion };
