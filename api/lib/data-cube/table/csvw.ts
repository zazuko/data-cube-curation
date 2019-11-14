import express from 'express'
import asyncMiddleware from 'middleware-async'
import { getTableId } from './index'
import { getTableAndSource } from '../../read-graphs/table/csvw'
import { buildCsvw } from '../../services/csvwBuilder'

export const get = asyncMiddleware(async (req: express.Request, res: express.Response) => {
  const tableId = getTableId(req)
  const tableDataset = await getTableAndSource(tableId)

  res.graph(await buildCsvw(tableDataset, tableId))
})
