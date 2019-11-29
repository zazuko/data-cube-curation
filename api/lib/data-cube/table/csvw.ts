import express from 'express'
import asyncMiddleware from 'middleware-async'
import { getTableAndSource } from '../../read-graphs/table/csvw'
import { buildCsvw } from '../../services/csvwBuilder'

export const get = asyncMiddleware(async (req: express.Request, res: express.Response) => {
  const tableId = req.resourceId.replace(/\/csvw$/, '')
  const tableDataset = await getTableAndSource(tableId)

  res.graph(await buildCsvw(tableDataset, tableId))
})
