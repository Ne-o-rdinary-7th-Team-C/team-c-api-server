const express = require("express");
const cors = require("cors");
const logger = require("./logger");

const morgan = require("morgan");

const cookieParser = require("cookie-parser");

const { PORT, JWT_SECRET } = require("./config.json");

const questionRouter = require("./routes/question.router");

const app = express();
const jwt = require("jsonwebtoken");

const parseBearerFromHeader = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    req.token = token;
    logger.info(`Parsed token: ${token}`);
  }
  next();
};

const decodeToken = (req, res, next) => {
  const token = req.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      logger.info(`Decoded token: ${JSON.stringify(decoded, 2)}`);
    } catch (error) {
      logger.error(`Token decoding error: ${error.message}`);
    }
  }
  next();
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(parseBearerFromHeader);
app.use(decodeToken);

app.use("/questions", questionRouter);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
