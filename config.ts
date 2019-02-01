import * as dotenv from 'dotenv'
import { isEqual } from 'lodash/fp'

dotenv.config()
const isTrue = isEqual('true')

export enum Environment {
  Test = 'TEST',
  Development = 'DEVELOPMENT',
  Staging = 'STAGING',
  Production = 'PRODUCTION'
}

type Config = {
  TOKEN_SECRET: string,
  TRANSACTION_SECRET: string,
  USE_SSL: boolean,
  FORCE_SYNC: boolean,
  PORT: string,
  ENV: Environment,
  FRONT_END_URL: string,
  STATIC_IP: boolean,
  ALLOW_ORIGIN: Array<string>,
};

export const config: Config = {
  TOKEN_SECRET: process.env.TOKEN_SECRET!,
  TRANSACTION_SECRET: process.env.TRANSACTION_SECRET!,
  USE_SSL: isTrue(process.env.USE_SSL),
  FORCE_SYNC: isTrue(process.env.FORCE_SYNC),
  PORT: process.env.PORT!,
  ENV: process.env.NODE_ENV! as Environment || Environment.Production,
  FRONT_END_URL: process.env.NODE_ENV === Environment.Test ? 'http://localhost:8081' : process.env.FRONT_END_URL!,
  STATIC_IP: isTrue(process.env.STATIC_IP),
  ALLOW_ORIGIN: process.env.ALLOW_ORIGIN ? process.env.ALLOW_ORIGIN.split(',') : ['http://twang.herokuapp.com', 'https://twang.herokuapp.com']
};
