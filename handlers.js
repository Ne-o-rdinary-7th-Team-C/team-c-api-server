const jwt = require("jsonwebtoken");
const logger = require("./logger");
const { JWT_SECRET } = require("./config.json");

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

const responseHandler = (req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "DEBUG_NEEDED", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    logger.error("Headers already sent. Skip error handling.");
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
};

module.exports = {
  parseBearerFromHeader,
  decodeToken,
  responseHandler,
  errorHandler,
};
