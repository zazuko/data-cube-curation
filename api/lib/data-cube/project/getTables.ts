import { Request, Response } from 'express'
import asyncMiddleware from 'middleware-async'
import { getProjectTables } from '../../read-graphs/table'

export const getTables = asyncMiddleware(async (req: Request, res: Response) => {
  res.graph(await getProjectTables(req.resourceId))
})
