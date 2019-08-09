import parse from 'csv-parse'
import uuid from 'uuid/v4'

const parserOptions = {
  to: 100,
  delimiter: ';',
}

export function initProject (req, res, next) {
  res.locals.projectId = `${process.env.BASE_URI}project/${uuid()}`
  next()
}

export function processCsv (req, res, next) {
  parse(
    req.body,
    parserOptions,
    (err, records) => {
      if (err) {
        next(err)
      }

      const columns = records[0]
      res.locals.columns = columns.map(col => ({
        id: `${res.locals.projectId}/column/${uuid()}`,
        title: col,
      }))

      next()
    })
}

export function setResponse (req, res, next) {
  res.status(201)
  res.setHeader('Location', res.locals.projectId)
  res.setLink(res.locals.projectId, 'canonical')
  next()
}
