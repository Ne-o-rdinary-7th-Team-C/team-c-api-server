class NotExistError extends Error {
  errorCode = "NOT_EXIST";
  statusCode = 404;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class AlreadyExistError extends Error {
  errorCode = "ALREADY_EXIST";
  statusCode = 409;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class InvalidInputError extends Error {
  errorCode = "INVALID_INPUT";
  statusCode = 400;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
class FailToUploadError extends Error {
  errorCode = "UPLOAD_FAILED";
  statusCode = 503;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class InvalidCredentialsError extends Error {
  errorCode = "UNAUTHORIZED";
  statusCode = 401;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

class UnauthorizedError extends Error {
  errorCode = "UNAUTHORIZED";
  statusCode = 401;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 사용자 닉네임 조회 에러

class UserNotFoundError extends Error {
  errorCode = "NOT_FOUND";
  statusCode = 404;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 서버 에러
class InternalServerError extends Error {
  errorCode = "SERVICE_UNAVAILABLE";
  statusCode = 503;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

module.exports = {
  NotExistError,
  AlreadyExistError,
  InvalidInputError,
  InvalidCredentialsError,
  UserNotFoundError,
  InternalServerError,
  FailToUploadError,
  UnauthorizedError,
};
