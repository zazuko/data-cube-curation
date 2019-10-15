import express from 'express'
import { getTableId } from './index'
import { getTableAndSource } from '../../read-graphs/table/csvw'
import { buildCsvw } from '../../services/csvwBuilder'

export async function get (req: express.DataCubeRequest, res: express.DataCubeResponse) {
  const tableId = getTableId(req)
  const tableDataset = await getTableAndSource(tableId)

  res.graph(await buildCsvw(tableDataset, tableId))
}
