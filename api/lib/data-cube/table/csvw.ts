import express from 'express'
import asyncMiddleware from 'middleware-async'
import { getTableAndSource } from '../../read-graphs/table/csvw'
import { buildCsvw } from '../../services/csvwBuilder'
import { getTableId } from '../../read-graphs/table/links'
import { NotFoundError } from '../../error'

export const get = asyncMiddleware(async (req: express.Request, res: express.Response) => {
  const tableId = await getTableId(req.resourceId)
  const dataset = await getTableAndSource(req.resourceId)

  if (!tableId) {
    throw new NotFoundError()
  }

  const csvw = await buildCsvw({ dataset, tableId })
  res.graph(csvw._node.dataset)
})
