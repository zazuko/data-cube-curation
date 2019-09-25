import parse from 'csv-parse'
import md5 from 'md5'
import express from 'express'
import { saveFile } from '../../storage'
import { createSource } from '../../domain/project'
import { projects, sources } from '../../storage/repository'

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

      res.locals.columns = header

      storeSample(res.locals.sourceId, rows).then(next).catch(next)
    })
}

export async function createSourceHandler (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  const project = await projects.load(`/project/${req.params.projectId}`)

  const createSourceCommand = {
    type: 'csv' as 'csv' | 'excel',
    columns: res.locals.columns,
    fileName: res.locals.sourceName,
  }

  project
    .factory(createSource)(createSourceCommand)
    .commit(sources)
    .then((source) => {
      res.status(201)
      res.setHeader('Location', '/' + source['@id'])
      next()
    })
    .catch(next)
}
