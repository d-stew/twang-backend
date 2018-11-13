import * as dotenv from 'dotenv'
import { isEqual } from 'lodash/fp'

dotenv.config()
const isTrue = isEqual('true')

export enum Environment {
  Test = 'test',
  Development = 'development',
  Staging = 'staging',
  Production = 'production'
}

type Config = {
  TOKEN_SECRET: string,
  TRANSACTION_SECRET: string,
  DATABASE_URL: string,
  USE_SSL: boolean,
  FORCE_SYNC: boolean,
  PORT: string,
  ENV: Environment,
  FRONT_END_URL: string,
  STATIC_IP: boolean,
  GOOGLE_API_KEY: string,
  VERSION: string,
  ALLOW_ORIGIN: Array<string>,
};

export const config: Config = {
  TOKEN_SECRET: process.env.TOKEN_SECRET!,
  TRANSACTION_SECRET: process.env.TRANSACTION_SECRET!,
  DATABASE_URL: process.env.NODE_ENV === Environment.Test ? 'postgres://postgres@localhost:5432/unself' : process.env.DATABASE_URL!,
  USE_SSL: isTrue(process.env.USE_SSL),
  FORCE_SYNC: isTrue(process.env.FORCE_SYNC),
  PORT: process.env.PORT!,
  ENV: process.env.NODE_ENV! as Environment,
  FRONT_END_URL: process.env.NODE_ENV === Environment.Test ? 'http://localhost:8081' : process.env.FRONT_END_URL!,
  STATIC_IP: isTrue(process.env.STATIC_IP),
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY!,
  VERSION: process.env.VERSION!,
  ALLOW_ORIGIN: process.env.ALLOW_ORIGIN ? process.env.ALLOW_ORIGIN.split(',') : ['https://app.unself.com', 'https://tool.unself.com']
};
