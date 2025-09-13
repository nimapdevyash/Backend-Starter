const httpStatus = require("http-status");

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class ValidationError extends CustomError {
  constructor(message = "Validation Error") {
    super(message, httpStatus.status.BAD_REQUEST); 
  }
}

class NoDataFoundError extends CustomError {
  constructor(message = "No Data Found") {
    super(message, httpStatus.status.OK);
  }
}

class DataFoundError extends CustomError {
  constructor(message = "Data Found") {
    super(message, httpStatus.status.CONFLICT); 
  }
}

class BadRequestError extends CustomError {
  constructor(message = "Bad Request") {
    super(message, httpStatus.status.BAD_REQUEST); 
  }
}

class InternalServerError extends CustomError {
  constructor(message = "Internal Server Error") {
    super(message, httpStatus.status.INTERNAL_SERVER_ERROR);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, httpStatus.status.UNAUTHORIZED);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(message, httpStatus.status.FORBIDDEN);
  }
}

class UnprocessableEntityError extends CustomError {
  constructor(message = "Unprocessable Entity") {
    super(message, httpStatus.status.UNPROCESSABLE_ENTITY);
  }
}

exports.throwIfCustomError = ({condition , message}) => {
  if(condition) {
    throw new CustomError(message);
  }
}

exports.throwIfValidationError = ({condition , message}) => {
  if(condition) {
    throw new ValidationError(message);
  }
}

exports.throwIfBadRequestError = ({condition , message}) => {
  if(condition) {
    throw new BadRequestError(message);
  }
}

exports.throwIfInternalServerError = ({condition , message}) => {
  if(condition) {
    throw new InternalServerError(message);
  }
}

exports.throwIfUnauthorizedError = ({condition , message}) => {
  if(condition) {
    throw new UnauthorizedError(message);
  }
}

exports.throwIfForbiddenError = ({condition , message}) => {
  if(condition) {
    throw new ForbiddenError(message);
  }
}

exports.throwIfUnprocessableEntityError = ({condition , message}) => {
  if(condition) {
    throw new UnprocessableEntityError(message);
  }
}

exports.throwIfDataFoundError = ({condition , message}) => {
  if(condition) {
    throw new DataFoundError(message);
  }
}

exports.throwIfNoDataFoundError = ({condition , message}) => {
  if(!condition) {
    throw new NoDataFoundError(message);
  }
}