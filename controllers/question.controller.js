const questionService = require('../services/question.service');
const { NotExistError} = require('../error');

const addAnswer = async (req, res) => {
    const { question_id } = req.params;
    const { questioned_user_id, content } = req.body;

    try {
        const answer = await questionService.addAnswer(question_id, questioned_user_id, content);
        // 성공 응답
        res.success(answer); // responseHandler에서 정의된 성공 응답 메서드 사용
    } catch (error) {
        console.error("Error in addAnswer:", error);

        // 에러 종류에 따른 응답 처리
        if (error instanceof NotExistError) {
            res.status(404).error({
                errorCode: "B100", // 에러 코드 정의
                reason: error.message, // 에러 메시지
                data: null,
            });
        } else {
            res.status(500).error({
                errorCode: "B999",
                reason: "Internal Server Error",
                data: null,
            });
        }
    }
};



//밥먹고와서 여기부터


const addQuestion = async (req, res) => {
    const { questioned_user_id, author_nickname, assigned_date, content } = req.body;

    try {
        const question = await questionService.addQuestion(questioned_user_id, author_nickname, assigned_date, content);
        // 성공 응답
        res.success(question); // responseHandler에서 정의한 성공 메서드 사용
    } catch (error) {
        console.error("Error in addQuestion:", error);

        // 에러 응답 처리
        if (error instanceof NotExistError) {
            res.status(404).error({
                errorCode: "A100", // 에러 코드 정의
                reason: error.message, // 에러 메시지
                data: null,
            });
        } else if (error instanceof Error) {
            res.status(400).error({
                errorCode: "A200",
                reason: error.message,
                data: null,
            });
        } else {
            res.status(500).error({
                errorCode: "A999",
                reason: "Internal Server Error",
                data: null,
            });
        }
    }
};




module.exports = { addAnswer, addQuestion };
