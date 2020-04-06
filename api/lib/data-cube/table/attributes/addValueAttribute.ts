import asyncMiddleware from 'middleware-async'
import express from 'express'
import { getTableId } from '../../../read-graphs/table/links'
import { NotFoundError } from '../../../error'
import { attributes, tables } from '../../../storage/repository'
import { getSingleAttribute } from '../../../read-graphs/attribute'
import { addValueAttribute } from '../../../domain/table/addValueAttribute'
import env from '../../../env'
import { AddValueAttributeCommand } from './Commands'

export const addValueAttributeHandler = asyncMiddleware(async (req: express.Request, res: express.Response) => {
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

  const attribute = await aggregate.factory(addValueAttribute)(req.buildModel(AddValueAttributeCommand)[0])

  const newAttribute = await attribute.commit(attributes)
  const persistedAttribute = await getSingleAttribute(newAttribute['@id'])

  if (persistedAttribute) {
    res.status(201)
    res.setHeader('Location', `${env.BASE_URI}${newAttribute['@id']}`)
    res.graph(persistedAttribute)
  } else {
    res.status(500)
    res.end()
  }
})
