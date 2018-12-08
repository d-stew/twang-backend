import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { log } from './src/utils/log.utils'
import { config, Environment } from './config'
import { MainRouter } from './src/routes/index'
import { TwitterRouter } from './src/routes/twitter.routes'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text({ type: 'text/csv', limit: '1mb' }))
app.use(cookieParser())

const corsOptions = config.ENV === Environment.Production ? { origin: config.ALLOW_ORIGIN } : {}
app.use(cors(corsOptions))

app.use('/', MainRouter)
app.use('/twitter', TwitterRouter)

// const graphQLServer = new ApolloServer({
//   ...myGraphQLSchema,
//   introspection: true,
//   uploads: false,
//   context: ({ req }: { req: AppRequest }) => {
//     const rawToken = defaultTo('', req.header('Authorization')).replace(
//       'Bearer ',
//       ''
//     )

//     return {
//       rawToken,
//       token: defaultTo({}, jwt.decode(rawToken)),
//       headers: {},
//       ip: req.ip
//     }
//   },
//   formatError: (error: AnyObject & { originalError?: AnyObject | Error }) => {
//     const isUnexpectedError =
//       error.originalError instanceof InternalError ||
//       error.originalError instanceof ExternalError
//     const isTwangError = error.originalError instanceof TwangError

//     log.error(error, '[Caught Error]:')
//     if (isTwangError) {
//       delete error.extensions.exception.context
//     }

//     return error
//   }
// })

// app.use(
//   '/graphql',
//   graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })
// )
// graphQLServer.applyMiddleware({ app })

export default app

// function rejectHTTP(req: Request, res: Response, next: NextFunction) {
//   if (req.headers['x-forwarded-proto'] !== 'https') {
//     const error = new ForbiddenError('SSL is required')

//     return res.status(403).send({
//       errors: [
//         {
//           message: error.message,
//           extensions: {
//             code: 'INTERNAL_SERVER_ERROR',
//             exception: pick(['code', 'context', 'msg', 'name'], error)
//           }
//         }
//       ]
//     })
//   }

//   return next()
// }

// // eslint-disable-next-line no-unused-vars
// function handle404(req: Request, res: Response, _: NextFunction) {
//   log.warn(
//     `No route found for request url: ${req.protocol}://${req.get('host')}${
//       req.originalUrl
//     }`
//   )
//   const error = new NotFoundError('Could not find the requested route.')
//   return res.status(404).send({
//     errors: [
//       {
//         message: error.message,
//         extensions: {
//           code: 'INTERNAL_SERVER_ERROR',
//           exception: pick(['code', 'context', 'msg', 'name'], error)
//         }
//       }
//     ]
//   })
// }

// // eslint-disable-next-line no-unused-vars
// function handleErrors(
//   error: AppError,
//   _: Request,
//   res: Response,
//   __: NextFunction
// ) {
//   if (error.name === ErrorType.MissingAuthToken) {
//     const err = new UnauthorizedError(`${error.message}.`)
//     return res.status(401).send({
//       errors: [
//         {
//           message: err.message,
//           extensions: {
//             code: 'INTERNAL_SERVER_ERROR',
//             exception: pick(['code', 'context', 'msg', 'name'], err)
//           }
//         }
//       ]
//     })
//   }

//   log.error(error, 'ERROR')
//   const err = new InternalError('Unknown Error.')
//   return res.status(500).send({
//     errors: [
//       {
//         message: err.message,
//         extensions: {
//           code: 'INTERNAL_SERVER_ERROR',
//           exception: pick(['code', 'context', 'msg', 'name'], err)
//         }
//       }
//     ]
//   })
// }

process.on('unhandledRejection', (err: Error) => {
  log.error(err, 'YOU HAVE AN UNHANDLED REJECTION! FIX IT!!!')
})
