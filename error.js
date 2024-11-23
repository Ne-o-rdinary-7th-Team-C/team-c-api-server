class CustomError extends Error {
  constructor(reason, data, errorCode, statusCode) {
    super(reason);
    this.reason = reason; // 에러 메시지
    this.data = data; // 추가 데이터
    this.errorCode = errorCode; // 에러 코드 (예: "NOT_EXIST")
    this.statusCode = statusCode; // HTTP 상태 코드 (예: 404)
  }
}

class NotExistError extends CustomError {
  constructor(reason, data = null) {
    super(reason, data, "NOT_EXIST", 404); // 404: Not Found
  }
}

class AlreadyExistError extends CustomError {
  constructor(reason, data = null) {
    super(reason, data, "ALREADY_EXIST", 409); // 409: Conflict
  }
}

class InvalidInputError extends CustomError {
  constructor(reason, data = null) {
    super(reason, data, "INVALID_INPUT", 400); // 400: Bad Request
  }
}

module.exports = { NotExistError, AlreadyExistError, InvalidInputError, CustomError };
