import uuid from 'uuid/v4'
import { getmodelId } from '../model'

const contentDispositionPattern = /attachment; filename="(.+)"/

function getSourceId (modelId: string, sourceGuid: string = uuid()) {
  return `${modelId}/source/${sourceGuid}`
}

export function initNew (req, res, next) {
  res.locals.modelId = getmodelId(req.params.modelId)
  res.locals.sourceId = getSourceId(res.locals.modelId)

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
  res.locals.modelId = getmodelId(req.params.modelId)
  res.locals.sourceId = getSourceId(res.locals.modelId, req.params.sourceId)
  next()
}
