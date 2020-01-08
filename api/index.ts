import cors from 'cors'
import path from 'path'
import url from 'url'
import express from 'express'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import debug from 'debug'
import { NotFoundError } from './lib/error'
import { httpProblemMiddleware } from './lib/error/middleware'
import frontend, { rootRedirect } from './frontend'
import hydraMiddleware from './lib/hydra-box'
import { log } from './lib/log'
import { resourceId } from './lib/express'
import env from './lib/env'

dotenvExpand(dotenv.config())
import('./lib/handlers')
if (env.has.DEBUG) {
  debug.enable(env.DEBUG)
}

const requestLogger = log.extend('request')
const requestErrorLogger = requestLogger.extend('error')
const headersLogger = requestLogger.extend('headers')
function logger (req: express.Request, res, next) {
  requestLogger(`${req.method} ${req.url}`)

  if (headersLogger.enabled) {
    headersLogger(`${Object.entries(req.headers).map(([header, value]) => `${header}: '${value}'`).join('\n')}`)
  }

  res.on('finish', () => {
    requestLogger(`Status ${res.statusCode}`)
  })

  next()
}

Promise.resolve().then(async () => {
  const baseUrl = `${env.BASE_URI}`

  const app = express()

  app.enable('trust proxy')
  if (env.has.NODE_ENV && env.NODE_ENV === 'production') {
    app.use('/app', frontend)
    app.get('/', rootRedirect)
  }
  app.use(logger)
  app.use(cors({
    exposedHeaders: ['link', 'location'],
  }))
  app.use(resourceId)
  app.use(await hydraMiddleware(path.join(__dirname, 'hydra')))
  app.use(function (req, res, next) {
    next(new NotFoundError())
  })
  app.use(function (err, req, res, next) {
    requestErrorLogger('Request failed: %o', err)
    next(err)
  })
  app.use(httpProblemMiddleware)

  const port = env.PORT || url.parse(baseUrl).port
  app.listen(port, () => {
    log(`listening at port ${port}`)
  })
}).catch(err => log.extend('error')('Failed to start: %O', err))
