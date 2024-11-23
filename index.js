const express = require("express");
const cors = require("cors");
const logger = require("./logger");

const morgan = require("morgan");

const cookieParser = require("cookie-parser");

const { PORT } = require("./config.json");
const userRouter = require("./routes/user.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/user", userRouter);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
