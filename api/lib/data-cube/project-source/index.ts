import { getProjectId } from '../project'

function getSourceId (projectId: string, sourceName: string) {
  return `${projectId}/source/${sourceName}`
}

export function initExisting (req, res, next) {
  res.locals.projectId = getProjectId(req.params.projectId)
  res.locals.sourceId = getSourceId(res.locals.projectId, req.params.sourceId)
  next()
}
