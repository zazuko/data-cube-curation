import cors from 'cors'
import path from 'path'
import hydraBox from 'hydra-box'
import url from 'url'
import express from 'express'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { NotFoundError } from './lib/error'
import { httpProblemMiddleware } from './lib/error/middleware'

dotenvExpand(dotenv.config())
import('./lib/handlers')

function logger (req, res, next) {
  process.stdout.write(`${req.method} ${req.url} `)

  res.on('finish', () => {
    process.stdout.write(`${res.statusCode}\n`)
  })

  next()
}

function hydraMiddleware () {
  const options: Record<string, unknown> = {
    debug: true,
    sparqlEndpointUrl: process.env.READ_MODEL_SPARQL_ENDPOINT,
    sparqlEndpointUpdateUrl: process.env.SPARQL_UPDATE_ENDPOINT,
    contextHeader: '/context/',
  }

  return hydraBox.fromUrl('/api', 'file://' + path.join(__dirname, 'hydra/api.ttl'), options)
}

Promise.resolve().then(async () => {
  const baseUrl = `${process.env.BASE_URI}`

  const app = express()

  app.use(logger)
  app.use(cors({
    exposedHeaders: ['link', 'location'],
  }))
  app.use(await hydraMiddleware())
  app.use(function (req, res, next) {
    next(new NotFoundError())
  })
  app.use(function (err, req, res, next) {
    console.log(err)
    next(err)
  })
  app.use(httpProblemMiddleware)

  app.listen((process.env.PORT || url.parse(baseUrl).port), () => {
    console.log(`listening at ${baseUrl}`)
  })
}).catch(err => console.error(err))
