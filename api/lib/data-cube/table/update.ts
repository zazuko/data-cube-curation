import express from 'express'
import asyncMiddleware from 'middleware-async'
import * as mutations from '../../domain/table/'
import { tables } from '../../storage/repository'
import { getRepresentation } from '../../read-graphs/table/index'
import { UpdateTable } from './Commands'

export const update = asyncMiddleware(async (req: express.Request, res: express.Response) => {
  const tableId = req.resourceId
  const state = await tables.load(req.resourceId)

  const cmd = req.buildModel(UpdateTable)[0]
  await state.mutation(mutations.update)(cmd).commit(tables)

  res.graph(await getRepresentation(tableId))
})
