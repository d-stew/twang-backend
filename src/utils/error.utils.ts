import { AnyObject } from '../types/app.types'
import { ErrorType } from '../types/app.enums'
import { config, Environment } from '../../config'
import { log } from '../utils/log.utils'

export const logError = (error: Error) => {
  /* istanbul ignore next */
  if (config.ENV !== Environment.Test) {
    log.error(error, '[Caught Error]:')
  }
}

export class TwangError extends Error {
  constructor(message: string, name: ErrorType, code: number, context: AnyObject = {}) {
    super()

    this.message = message
    this.name = name
    this.code = code
    this.context = context
  }

  code: number
  context: any
  msg: string

  get message() {
    return `${this.code}|${this.name}|${this.msg}`
  }

  set message(value) {
    this.msg = value
  }
}

export class BadRequestError extends TwangError {
  constructor(message: string, context?: AnyObject) {
    super(message, ErrorType.BadRequest, 400, context)
  }
}

export class UnauthorizedError extends TwangError {
  constructor(message: string, context?: AnyObject) {
    super(message, ErrorType.Unauthorized, 401, context)
  }
}

export class ForbiddenError extends TwangError {
  constructor(message: string, context?: AnyObject) {
    super(message, ErrorType.Forbidden, 403, context)
  }
}

export class NotFoundError extends TwangError {
  constructor(message: string, context?: AnyObject) {
    super(message, ErrorType.NotFound, 404, context)
  }
}

export class ConflictError extends TwangError {
  constructor(message: string, context?: AnyObject) {
    super(message, ErrorType.Conflict, 409, context)
  }
}

export class InternalError extends TwangError {
  constructor(message: string, context?: AnyObject) {
    super(message, ErrorType.InternalError, 500, context)
  }
}

export class ExternalError extends TwangError {
  constructor(message: string, context?: AnyObject) {
    super(message, ErrorType.ExternalError, 502, context)
  }
}
