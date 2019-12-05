import asyncMiddleware from 'middleware-async'
import { expand } from '@zazuko/rdf-vocabularies'
import express from 'express'
import { getTableId } from '../../../read-graphs/table/links'
import { NotFoundError } from '../../../error'
import { buildVariables } from '../../../buildVariables'
import { attributes, tables } from '../../../storage/repository'
import { getSingleAttribute, getTableAttributes } from '../../../read-graphs/attribute'
import { addValueAttribute } from '../../../domain/table/addValueAttribute'

export const addValueAttributeHandler = asyncMiddleware(async (req: express.Request, res: express.Response) => {
  const tableId = await getTableId(req.resourceId)
  if (!tableId) {
    throw new NotFoundError()
  }

  const variables = buildVariables(req, {
    predicate: expand('rdf:predicate'),
    datatype: expand('dataCube:datatype'),
    language: expand('dataCube:language'),
    columnId: expand('dataCube:column'),
  })

  const aggregate = await tables.load(tableId)
  const table = await aggregate.state
  if (!table) {
    res.status(404)
    res.end()
    return
  }

  const attribute = await aggregate.factory(addValueAttribute)({
    predicate: variables.predicate && variables.predicate.value,
    datatype: variables.datatype && variables.datatype.value,
    columnId: variables.columnId && variables.columnId.value,
    language: variables.language && variables.language.value,
  })

  const newAttribute = await attribute.commit(attributes)

  res.status(201)
  res.setHeader('Location', `${process.env.BASE_URI}${newAttribute['@id']}`)
  res.graph(await getSingleAttribute(newAttribute['@id']))
})

export const getAttributes = asyncMiddleware(async (req: express.Request, res: express.Response) => {
  const tableId = await getTableId(req.resourceId)
  if (!tableId) {
    throw new NotFoundError()
  }

  res.graph(await getTableAttributes(tableId))
})
