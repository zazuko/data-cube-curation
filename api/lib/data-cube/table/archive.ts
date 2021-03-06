import { Request } from 'express'
import { asyncMiddleware } from 'middleware-async'
import { tables } from '../../storage/repository'
import { archiveTable } from '../../domain/table/archive'

export const archive = asyncMiddleware(async (req: Request, res, next) => {
  const tableId = req.resourceId
  const table = await tables.load(tableId)

  table
    .mutation(archiveTable)(null as never)
    .delete()
    .commit(tables)
    .then(() => {
      res.status(204)
      res.end()
    })
    .catch(next)
})
