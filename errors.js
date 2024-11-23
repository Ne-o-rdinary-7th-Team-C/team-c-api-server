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

// 기본 에러 클래스
class BaseError extends Error {
  constructor(errorCode, reason, data = null) {
    super(reason);
    this.errorCode = errorCode;
    this.reason = reason;
    this.data = data;
  }
}

// 로그인 관련 에러
class LoginValidationError extends BaseError {
  constructor(reason = "로그인 혹은 패스워드가 잘못되었습니다", data = null) {
    super("A400", reason, data);
  }
}

class InvalidCredentialsError extends BaseError {
  constructor(
    reason = "사용자 혹은 비밀번호가 일치하지 않습니다",
    data = null
  ) {
    super("A100", reason, data);
  }
}

// 사용자 닉네임 조회 에러
class UserNotFoundError extends BaseError {
  constructor(reason = "유저 정보를 조회할 수 없습니다", data = null) {
    super("A404", reason, data);
  }
}

// 서버 에러
class InternalServerError extends BaseError {
  constructor(reason = "Server Error", data = null) {
    super("A500", reason, data);
  }
}

module.exports = {
  NotExistError,
  AlreadyExistError,
  InvalidInputError,
  LoginValidationError,
  InvalidCredentialsError,
  UserNotFoundError,
  InternalServerError,
  FailToUploadError,
};
