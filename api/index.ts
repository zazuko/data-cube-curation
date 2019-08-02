import * as cors from 'cors'
import * as path from 'path'
import * as hydraBox from 'hydra-box'
import * as url from 'url'
import * as express from 'express'
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'

dotenvExpand(dotenv.config())

function logger (req, res, next) {
  process.stdout.write(`${req.method} ${req.url} `)

  res.on('finish', () => {
    process.stdout.write(`${res.statusCode}\n`)
  })

  next()
}

function hydraMiddleware () {
  return hydraBox.fromUrl('/api', 'file://' + path.join(__dirname, 'hydra/api.ttl'), {
    debug: true,
    sparqlEndpointUrl: process.env.SPARQL_ENDPOINT,
    sparqlEndpointUpdateUrl: process.env.SPARQL_ENDPOINT,
    contextHeader: '/context/',
  })
}

Promise.resolve().then(async () => {
  const baseUrl = `${process.env.BASE_URI}`

  const app = express()

  app.use(logger)
  app.use(cors({
    exposedHeaders: ['link', 'location'],
  }))
  app.use(await hydraMiddleware())

  app.listen(url.parse(baseUrl).port, () => {
    console.log(`listening at ${baseUrl}`)
  })
}).catch(err => console.error(err))
