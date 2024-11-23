const jwt = require("jsonwebtoken");
const logger = require("./logger");
const { JWT_SECRET } = require("./config.json");
const swaggerAutogen = require("swagger-autogen");

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

const swaggerHandler = async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.1.0",
    disableLogs: true,
    writeOutputFile: false,
  };

  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./routes/*.js", "./controllers/*.js"];
  const doc = {
    info: {
      title: "Ne(o)rdinary Hackathon: Team C",
      description: "감사합니다.",
      contact: {
        name: "Team C",
        email: "saveearth1@cau.ac.kr",
        url: "https://github.com/Ne-o-rdinary-7th-Team-C",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    // 서버 정보
    servers: [
      {
        url: "https://test2.shop",
        description: "AWS EC2 서버",
      },
    ],

    // 보안 설정
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      // 인증 스키마
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      // 공통 응답 스키마
      schemas: {
        Success: {
          type: "object",
          properties: {
            resultType: {
              type: "string",
              description: "결과 타입",
            },
            success: {
              type: "object",
              description: "성공 데이터",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            errorCode: {
              type: "string",
              description: "에러 코드",
            },
            reason: {
              type: "string",
              description: "에러 사유",
            },
            data: {
              type: "object",
              description: "에러 데이터",
            },
          },
        },
      },
    },

    // 외부 문서
    externalDocs: {
      description: "GitHub Repository",
      url: "https://github.com/UMC-7th-CAU-NodeJS/umc-7-kyeoungwoon",
    },
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
};

module.exports = {
  parseBearerFromHeader,
  decodeToken,
  responseHandler,
  errorHandler,
  swaggerHandler,
};
