const express = require("express");
const cors = require("cors");
const logger = require("./logger");
const handlers = require("./handlers");

const morgan = require("morgan");

const cookieParser = require("cookie-parser");

const { PORT } = require("./config.json");

const app = express();

app.use(cors());
app.use(express.json());
app.use(handlers.responseHandler); // res.success와 res.error 추가
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));


app.use("/questions", require("./routes/questionRouter"));


// 에러 핸들러 등록 (마지막에 위치해야 함)
app.use(handlers.errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

