import * as httpCodes from 'http-status-codes';
/* tslint:disable:max-classes-per-file */
export enum ErrorType {
  NotFound = 'NotFound',
  BadRequest = 'BadRequest',
  InternalError = 'InternalError',
  Unauthorized = 'Unauthorized',
  PaymentRequired = 'PaymentRequired',
}

export class NotFoundError extends Error {
  type = ErrorType.NotFound;
  constructor(message: string) {
    super(message);
  }
}

export class BadRequest extends Error {
  type = ErrorType.BadRequest;
  constructor(message: string) {
    super(message);
  }
}

export class UnAuthorized extends Error {
  type = ErrorType.Unauthorized;
  constructor(message: string) {
    super(message);
  }
}

export class PaymentRequired extends Error {
  type = ErrorType.PaymentRequired;
  constructor(message: string) {
    super(message);
  }
}

export class InternalError extends Error {
  type = ErrorType.InternalError;

  constructor(message: string) {
    super(message);
  }
}

export function errorStatusCode(ex: any): httpCodes.StatusCodes {
  let statusCode: httpCodes.StatusCodes;
  switch (ex.type) {
    case ErrorType.NotFound:
      statusCode = httpCodes.StatusCodes.NOT_FOUND;
      break;
    case ErrorType.BadRequest:
      statusCode = httpCodes.StatusCodes.BAD_REQUEST;
      break;
    case ErrorType.Unauthorized:
      statusCode = httpCodes.StatusCodes.UNAUTHORIZED;
      break;
    case ErrorType.PaymentRequired:
      statusCode = httpCodes.StatusCodes.PAYMENT_REQUIRED;
      break;
    default:
      statusCode = httpCodes.StatusCodes.INTERNAL_SERVER_ERROR;
      break;
  }
  return statusCode;
}
