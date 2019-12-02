import express from 'express'
import asyncMiddleware from 'middleware-async'
import { getTableAndSource } from '../../read-graphs/table/csvw'
import { buildCsvw } from '../../services/csvwBuilder'
import { getTableId } from '../../read-graphs/table/links'

export const get = asyncMiddleware(async (req: express.Request, res: express.Response) => {
  const tableId = await getTableId(req.resourceId)
  const tableDataset = await getTableAndSource(req.resourceId)

  res.graph(await buildCsvw(tableDataset, tableId))
})
