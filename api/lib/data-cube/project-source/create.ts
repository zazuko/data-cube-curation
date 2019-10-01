import parse from 'csv-parse'
import express from 'express'
import { createSource } from '../../domain/project'
import { projects, sources } from '../../storage/repository'
import { duplicateNameErrorResponse } from './error-duplicate-name'

const parserOptions = {
  to: 100,
  delimiter: ';',
}

export function parseCsv (req, res, next) {
  parse(
    req.body,
    parserOptions,
    (err, [header, ...rows]) => {
      if (err) {
        next(err)
      }

      res.locals.columns = header
      res.locals.fileSample = rows
      next()
    })
}

export async function createSourceHandler (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  const project = await projects.load(`/project/${req.params.projectId}`)

  const contentDispositionPattern = /attachment; filename="(.+)"/
  const contentDisposition: string = req.headers['content-disposition']
  if (contentDisposition) {
    if (contentDispositionPattern.test(contentDisposition)) {
      res.locals.sourceName = contentDisposition.match(contentDispositionPattern)[1]
    }
  } else {
    res.locals.sourceName = 'unnamed'
  }

  const createSourceCommand = {
    type: 'csv' as 'csv' | 'excel',
    columns: res.locals.columns,
    fileName: res.locals.sourceName,
    sample: res.locals.fileSample,
  }

  const source = await project
    .factory(createSource)(createSourceCommand)

  source.commit(sources)
    .then((source) => {
      res.status(201)
      res.setHeader('Location', `${process.env.BASE_URI}${source['@id']}`)
      next()
    })
    .catch((e: Error) => {
      if (e.message.includes('It has already been modified')) {
        duplicateNameErrorResponse(req, res)
      } else {
        next(e)
      }
    })
}
