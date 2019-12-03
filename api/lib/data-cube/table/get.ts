import express from 'express'
import asyncMiddleware from 'middleware-async'
import { getRepresentation } from '../../read-graphs/table/index'

export const get = asyncMiddleware(async (req: express.Request, res: express.Response) => {
  const tableId = req.resourceId
  res.graph(await getRepresentation(tableId))
})
