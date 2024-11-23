const express = require("express");
const cors = require("cors");
const logger = require("./logger");

const morgan = require("morgan");

const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.route");
const { PORT } = require("./config.json");
const {
  errorHandler,
  responseHandler,
  parseBearerFromHeader,
  decodeToken,
} = require("./handlers");

const app = express();
const jwt = require("jsonwebtoken");

app.use(responseHandler);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(parseBearerFromHeader);
app.use(decodeToken);
app.use("/user", userRouter);
// Error handler는 최하단에 위치해야 합니다.
// 하단 코드를 건들지 마세요.
app.use(errorHandler);
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
