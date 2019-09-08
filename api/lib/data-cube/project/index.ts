import uuid from 'uuid/v4'
export { get } from './get'

export function getProjectId (projectGuid: string = uuid()) {
  return `${process.env.BASE_URI}project/${projectGuid}`
}

export function initNew (req, res, next) {
  res.locals.projectId = getProjectId(uuid())
  next()
}

export function initExisting (req, res, next) {
  res.locals.projectId = getProjectId(req.params.projectId)
  next()
}
