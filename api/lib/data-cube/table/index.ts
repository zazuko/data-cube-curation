import express from 'express'
import asyncMiddleware from 'middleware-async'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import { selectFactTableSource } from '../../domain/project'
import { projects, tables, attributes } from '../../storage/repository'
import { addAttribute } from '../../domain/table/addAttribute'
import { getTableAttributes } from '../../read-graphs/attribute'
import { getTableId } from '../../read-graphs/table/links'
import { NotFoundError } from '../../error'
import { getProjectId } from '../../read-graphs/project/links'

export { get } from './get'
export { createTable } from './createDimensionTable'
export { archive } from './archive'

export const createFactTable = asyncMiddleware(async (req: express.Request, res, next) => {
  const projectId = await getProjectId(req.resourceId)
  if (!projectId) {
    throw new NotFoundError()
  }

  const variables = buildVariables(req, {
    source: expand('dataCube:source'),
    name: expand('schema:name'),
  })

  const project = await projects.load(projectId)
  if (!project.state) {
    res.status(404)
    res.end()
    return
  }

  project.mutation(selectFactTableSource)({
    sourceId: variables.source.value,
    tableName: variables.name.value,
  })
    .commit(projects)
    .then(() => {
      res.status(201)
      res.setHeader('Location', `${projectId}/table/${variables.name.value}`)
      next()
    })
    .catch(next)
})

export const addAttributeHandler = asyncMiddleware(async (req: express.Request, res, next) => {
  const tableId = await getTableId(req.resourceId)
  if (!tableId) {
    throw new NotFoundError()
  }

  const variables = buildVariables(req, {
    name: expand('schema:name'),
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

  const attribute = await aggregate.factory(addAttribute)({
    predicate: variables.predicate && variables.predicate.value,
    datatype: variables.datatype && variables.datatype.value,
    columnId: variables.columnId && variables.columnId.value,
    language: variables.language && variables.language.value,
  })

  attribute.commit(attributes)
    .then(newAttribute => {
      res.status(201)
      res.setHeader('Location', `${process.env.BASE_URI}${newAttribute['@id']}`)
      next()
    })
    .catch(next)
})

export const getAttributes = asyncMiddleware(async (req: express.Request, res: express.Response, next) => {
  const tableId = await getTableId(req.resourceId)
  if (!tableId) {
    throw new NotFoundError()
  }

  getTableAttributes(tableId)
    .then(dataset => {
      res.graph(dataset)
    })
    .catch(next)
})
