export enum ErrorType {
  BadRequest = 'BadRequest',
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  NotFound = 'NotFound',
  Conflict = 'Conflict',
  MethodNotAllowed = 'MethodNotAllowed',
  InternalError = 'InternalError',
  ExternalError = 'ExternalError',
  UnknownError = 'UnknownError',
  MissingAuthToken = 'UnauthorizedError',
}
