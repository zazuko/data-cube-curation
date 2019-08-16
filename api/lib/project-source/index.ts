import uuid from 'uuid/v4'
import { getProjectId } from '../project'

const contentDispositionPattern = /attachment; filename="(.+)"/

function getSourceId (projectId: string, sourceGuid: string = uuid()) {
  return `${projectId}/source/${sourceGuid}`
}

export function initNew (req, res, next) {
  res.locals.projectId = getProjectId(req.params.projectId)
  res.locals.sourceId = getSourceId(res.locals.projectId)

  const contentDisposition: string = req.headers['content-disposition']
  if (contentDisposition) {
    if (contentDispositionPattern.test(contentDisposition)) {
      res.locals.sourceName = contentDisposition.match(contentDispositionPattern)[1]
    }
  } else {
    res.locals.sourceName = 'unnamed source'
  }
  next()
}

export function initExisting (req, res, next) {
  res.locals.projectId = getProjectId(req.params.projectId)
  res.locals.sourceId = getSourceId(res.locals.projectId, req.params.sourceId)
  next()
}
