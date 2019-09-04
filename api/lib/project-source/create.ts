import parse from 'csv-parse'
import uuid from 'uuid/v4'
import md5 from 'md5'
import { saveFile } from '../storage'

const parserOptions = {
  to: 100,
  delimiter: ';',
}

function storeSample (sourceId: string, rows: string[][]) {
  const csvStringified = rows.map(row => row.map(cell => `"${cell}"`).join(';')).join('\n')

  return saveFile(md5(sourceId), csvStringified)
}

export function processCsv (req, res, next) {
  parse(
    req.body,
    parserOptions,
    (err, [header, ...rows]) => {
      if (err) {
        next(err)
      }

      res.locals.columns = header.map(column => ({
        id: `${res.locals.sourceId}/column/${uuid()}`,
        title: column,
      }))

      storeSample(res.locals.sourceId, rows).then(next).catch(next)
    })
}

export function setResponse (req, res, next) {
  res.status(201)
  res.setHeader('Location', res.locals.sourceId)
  next()
}
