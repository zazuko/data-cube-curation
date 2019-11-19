import cors from 'cors'
import path from 'path'
import hydraBox from 'hydra-box'
import url from 'url'
import express from 'express'
import replace from 'replace-in-file'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import debug from 'debug'
import { NotFoundError } from './lib/error'
import { httpProblemMiddleware } from './lib/error/middleware'
import frontend, { rootRedirect } from './frontend'

dotenvExpand(dotenv.config())
import('./lib/handlers')
debug.enable(process.env.DEBUG)

const dataCubeLogger = debug('dataCube')
const requestLogger = dataCubeLogger.extend('request')
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

async function hydraMiddleware () {
  let authentication
  if (process.env.SPARQL_ENDPOINT_USERNAME && process.env.SPARQL_ENDPOINT_PASSWORD) {
    authentication = {
      user: process.env.SPARQL_ENDPOINT_USERNAME,
      password: process.env.SPARQL_ENDPOINT_PASSWORD,
    }
  }

  const options: Record<string, unknown> = {
    debug: true,
    sparqlEndpointUrl: process.env.READ_MODEL_SPARQL_ENDPOINT,
    sparqlEndpointUpdateUrl: process.env.SPARQL_UPDATE_ENDPOINT,
    contextHeader: '/context/',
    authentication,
  }

  const apiDocsPath = path.join(__dirname, 'hydra/api.ttl')
  await replace({
    files: apiDocsPath,
    from: /@base <.+>/,
    to: `@base <${process.env.BASE_URI}>`,
  })

  return hydraBox.fromUrl('/api', 'file://' + apiDocsPath, options)
}

Promise.resolve().then(async () => {
  const baseUrl = `${process.env.BASE_URI}`

  const app = express()

  app.enable('trust proxy')
  if (process.env.NODE_ENV === 'production') {
    app.use('/app', frontend)
    app.get('/', rootRedirect)
  }
  app.use(logger)
  app.use(cors({
    exposedHeaders: ['link', 'location'],
  }))
  app.use(await hydraMiddleware())
  app.use(function (req, res, next) {
    next(new NotFoundError())
  })
  app.use(function (err, req, res, next) {
    requestErrorLogger('Request failed: %o', err)
    next(err)
  })
  app.use(httpProblemMiddleware)

  const port = process.env.PORT || url.parse(baseUrl).port
  app.listen(port, () => {
    dataCubeLogger(`listening at port ${port}`)
  })
}).catch(err => dataCubeLogger.extend('error')('Failed to start: %O', err))
