import { Request, Response } from 'express'
import parse from 'csv-parse'
import detect from 'detect-csv'
import asyncMiddleware from 'middleware-async'
import { createSource } from '../../domain/project'
import { projects, sources } from '../../storage/repository'
import { NotFoundError } from '../../error'
import { getProjectId } from '../../read-graphs/project/links'
import { getRepresentation } from '../../read-graphs/source/index'
import env from '../../env'

export function parseCsv (req, res, next) {
  let delimiter = ','
  const detectedCsvFormat = detect(req.body)
  if (detectedCsvFormat) {
    delimiter = detectedCsvFormat.delimiter
  }

  const parserOptions = {
    to: 100,
    delimiter,
  }

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

export const createSourceHandler = asyncMiddleware(async (req: Request, res: Response) => {
  const projectId = await getProjectId(req.resourceId)
  if (!projectId) {
    throw new NotFoundError()
  }

  const project = await projects.load(projectId)

  const contentDispositionPattern = /attachment; filename="(.+)"/
  const contentDisposition = req.headers['content-disposition']
  if (contentDisposition) {
    if (contentDispositionPattern.test(contentDisposition)) {
      const matchedName = contentDisposition.match(contentDispositionPattern)
      if (matchedName) {
        res.locals.sourceName = matchedName[1]
      }
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

  const sourceAggregate = await source.commit(sources)
  const sourceId = `${env.BASE_URI}${sourceAggregate['@id']}`

  res.status(201)
  res.setHeader('Location', sourceId)
  res.graph((await getRepresentation(sourceId)).toStream())
})
