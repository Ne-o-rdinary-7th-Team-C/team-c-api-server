export class NotExistError extends Error {
  errorCode = "NOT_EXIST";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class AlreadyExistError extends Error {
  errorCode = "ALREADY_EXIST";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class InvalidInputError extends Error {
  errorCode = "INVALID_INPUT";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
