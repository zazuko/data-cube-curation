import express, { Request, Response } from 'express'
import asyncMiddleware from 'middleware-async'
import { expand } from '@zazuko/rdf-vocabularies'
import { DomainError } from '@tpluscode/fun-ddr'
import { getTableId } from '../../../read-graphs/table/links'
import { NotFoundError } from '../../../error'
import { buildVariables } from '../../../buildVariables'
import { addValueAttributeHandler } from './addValueAttribute'
import { addReferenceAttributeHandler } from './addReferenceAttribute'
import { getTableAttributes } from '../../../read-graphs/attribute'

export const addAttributeHandler = asyncMiddleware(async (req: Request, res: Response, next) => {
  const tableId = await getTableId(req.resourceId)
  if (!tableId) {
    throw new NotFoundError()
  }

  const { attributeType } = buildVariables(req, {
    attributeType: expand('rdf:type'),
  })

  const isValueAttribute = attributeType.values.includes(expand('dataCube:ValueAttribute'))
  const isReferenceAttribute = attributeType.values.includes(expand('dataCube:ReferenceAttribute'))

  if (isValueAttribute && isReferenceAttribute) {
    throw new DomainError(tableId, 'Cannot create attribute', `The provided rdf types are mutually exclusive`)
  }

  if (isValueAttribute) { return addValueAttributeHandler(req, res, next) }
  if (isReferenceAttribute) { return addReferenceAttributeHandler(req, res, next) }

  throw new DomainError(tableId, 'Cannot create attribute', `Unrecognized attribute type(s): ${attributeType.values.join(', ')}`)
})

export const getAttributes = asyncMiddleware(async (req: express.Request, res: express.Response) => {
  const tableId = await getTableId(req.resourceId)
  if (!tableId) {
    throw new NotFoundError()
  }

  res.graph(await getTableAttributes(tableId))
})
