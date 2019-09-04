import { DataCubeRequest, Response } from 'express'
import { getProjectId } from '../project'
import { ask } from '../../sparql'

const contentDispositionPattern = /attachment; filename="(.+)"/

function getSourceId (projectId: string, sourceName: string) {
  return `${projectId}/source/${sourceName}`
}

export async function initNew (req: DataCubeRequest, res: Response, next) {
  res.locals.projectId = getProjectId(req.params.projectId)

  const contentDisposition: string = req.headers['content-disposition']
  if (contentDisposition) {
    if (contentDispositionPattern.test(contentDisposition)) {
      res.locals.sourceName = contentDisposition.match(contentDispositionPattern)[1]
    }
  } else {
    res.locals.sourceName = 'unnamed source'
  }

  res.locals.sourceId = getSourceId(res.locals.projectId, res.locals.sourceName)

  if (await ask(req.sparql, `<${res.locals.sourceId}> ?p ?o`) === true) {
    res.status(409)
    res.end()
    return
  }

  next()
}

export function initExisting (req, res, next) {
  res.locals.projectId = getProjectId(req.params.projectId)
  res.locals.sourceId = getSourceId(res.locals.projectId, req.params.sourceId)
  next()
}
