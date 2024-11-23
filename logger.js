const winston = require("winston");
const { format } = require("winston");
const { combine, timestamp, printf } = format;

// 함수명 트래킹을 위한 커스텀 포맷
const customFormat = printf(({ level, message, timestamp, stack }) => {
  const functionName = stack ? stack.split("\n")[0].trim() : "N/A";
  return `${timestamp} [${level}] [${functionName}]: ${message}`;
});

// 로거 설정
const logger = winston.createLogger({
  level: "info", // 기본 로그 레벨
  format: combine(
    timestamp(), // 타임스탬프 추가
    winston.format.errors({ stack: true }), // 스택 트레이스 추가
    // JSON 포맷 적용
    winston.format.json({ space: 2 })
  ),
  transports: [
    new winston.transports.Console({ format: combine(customFormat) }), // 콘솔에 로그 출력
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
    }), // 에러 로그를 파일에 기록
    new winston.transports.File({ filename: "./logs/combined.log" }), // 모든 로그를 파일에 기록
  ],
});

module.exports = logger; // 다른 모듈에서 사용 가능하도록 내보내기
