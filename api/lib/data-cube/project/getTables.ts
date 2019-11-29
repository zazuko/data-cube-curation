import { Request, Response } from 'express'
import asyncMiddleware from 'middleware-async'
import { getProjectTables } from '../../read-graphs/table'

export const getTables = asyncMiddleware(async (req: Request, res: Response) => {
  const projectId = req.resourceId.replace(/\/tables$/, '')
  res.graph(await getProjectTables(projectId))
})
