import express from 'express'
import asyncMiddleware from 'middleware-async'
import { getProjectId } from './index'
import { getProjectTables } from '../../read-graphs/table'

export const getTables = asyncMiddleware(async (req, res: express.DataCubeResponse) => {
  const projectId = getProjectId(req.params.projectId)
  res.graph(await getProjectTables(projectId))
})
