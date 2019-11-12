import express from 'express'
import { getProjectId } from '../project'

function getSourceId (projectId: string, sourceName: string) {
  return `${projectId}/source/${sourceName}`
}

export function getSourceIdFromRoute (req: express.Request) {
  const projectId = getProjectId(req.params.projectId)
  return {
    projectId,
    sourceId: getSourceId(projectId, req.params.sourceId),
  }
}

export function initExisting (req, res, next) {
  const { projectId, sourceId } = getSourceIdFromRoute(req)

  res.locals.projectId = projectId
  res.locals.sourceId = sourceId
  next()
}
