import asyncMiddleware from 'middleware-async'
import { Request, Response } from 'express'
import { getTableId } from '../../../read-graphs/table/links'
import { NotFoundError } from '../../../error'
import { attributes, tables } from '../../../storage/repository'
import { addReferenceAttribute } from '../../../domain/table/addReferenceAttribute'
import { getSingleAttribute } from '../../../read-graphs/attribute'
import env from '../../../env'
import { AddReferenceAttributeCommand } from './Commands'

export const addReferenceAttributeHandler = asyncMiddleware(async (req: Request, res: Response) => {
  const tableId = await getTableId(req.resourceId)
  if (!tableId) {
    throw new NotFoundError()
  }

  const aggregate = await tables.load(tableId)
  const table = await aggregate.state
  if (!table) {
    res.status(404)
    res.end()
    return
  }

  const attribute = await aggregate.factory(addReferenceAttribute)(req.buildModel(AddReferenceAttributeCommand)[0])

  const newAttribute = await attribute.commit(attributes)

  res.status(201)
  res.setHeader('Location', `${env.BASE_URI}${newAttribute['@id']}`)
  res.graph(await getSingleAttribute(newAttribute['@id']))
})
