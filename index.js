const express = require("express");
const cors = require("cors");
const logger = require("./logger");

const morgan = require("morgan");

const cookieParser = require("cookie-parser");

const { PORT } = require("./config.json");

const questionRouter = require("./routes/question.router");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/questions", questionRouter);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
