// 외부 패키지
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// 프로젝트 내부 패키지
const logger = require("./logger");
const { PORT } = require("./config.json");
const {
  errorHandler,
  responseHandler,
  parseBearerFromHeader,
  decodeToken,
  swaggerHandler,
} = require("./handlers");

// 라우터
const userRouter = require("./routes/user.route");
const questionRouter = require("./routes/question.router");
const answerRouter = require("./routes/answer.route");

const swaggerUiExpress = require("swagger-ui-express");

const app = express();

app.use(responseHandler); //  요청, 응답 핸들링 미들웨어

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev")); // morgan logger
app.use(parseBearerFromHeader); // 헤더에서 token 분리, req.token에 저장
app.use(decodeToken); // req.token을 해독하여 req.user에 저장

app.use("/questions", questionRouter);
app.use("/answers", answerRouter);
app.use("/user", userRouter);

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(
    {},
    {
      swaggerOptions: {
        url: "/openapi.json",
      },
    }
  )
);
app.get("/openapi.json", swaggerHandler);

// Error handler는 최하단에 위치해야 합니다.
// 하단 코드를 건들지 마세요.
app.use(errorHandler);
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
