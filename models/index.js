const { Sequelize } = require("sequelize");
const config = require("../config.json");
const logger = require("../logger");
const { User, Question, Answer } = require("./define");

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(
  "hackathon",
  config.MYSQL_USER,
  config.MYSQL_PASSWORD,
  {
    host: config.MYSQL_HOST,
    port: config.MYSQL_PORT,
    dialect: "mysql",
    logging: (msg) => logger.info(`[Sequelize Log]: ${msg}`),
    timezone: "+09:00",
    pool: {
      max: 10, // 최대 연결 수
      min: 0, // 최소 연결 수
      acquire: 30000, // 연결을 가져오는 최대 시간 (ms)
      idle: 10000, // 연결이 유휴 상태일 때 종료되기까지의 시간 (ms)
    },
  }
);

const models = {
  User: User,
  Question: Question,
  Answer: Answer,
};

// 모델 초기화
for (const model of Object.values(models)) {
  model.init(sequelize);
}

// 모델 간 관계 설정
for (const model of Object.values(models)) {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
}

const db = {
  ...models,
  sequelize,
};

module.exports = db;
