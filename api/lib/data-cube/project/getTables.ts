import express from 'express'
import { getProjectId } from './index'
import { getProjectTables } from '../../read-graphs/table'
import { asyncRoute } from '../../express'

export const getTables = asyncRoute(async (req: express.DataCubeRequest, res: express.DataCubeResponse) => {
  const projectId = getProjectId(req.params.projectId)
  res.graph(await getProjectTables(projectId))
})
