import * as parse from 'csv-parse'
import * as uuid from 'uuid/v4'

const parserOptions = {
  to: 100,
  delimiter: ';',
}

export function initLocals (req, res, next) {
  res.locals.projectId = `${process.env.BASE_URI}project/${uuid()}`
  next()
}

export function setResponse (req, res, next) {
  res.status(201)
  res.setHeader('Location', res.locals.projectId)
  next()
}
