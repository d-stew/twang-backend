import { Request } from 'express'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Identifier = { id: string; name: string }
export type AppRequest = Request & {
  token?: string
}

export type AppError = Error & { code: number }

export type AnyObject = { [key: string]: any }

export type PartialUserAuthToken = {
  exp: number
  iat: number
  userCredentialId: string
}

export type AuthToken = PartialUserAuthToken & {
  userId: string
  permissions: {
    [key: string]: { organizations: Array<{ id: string; name: string }> | null }
  }
}
export type TransactionToken = { userCredentialId?: string; email: string }