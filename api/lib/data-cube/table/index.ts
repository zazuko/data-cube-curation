import express from 'express'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import { getProjectId } from '../project'
import { selectFactTableSource } from '../../domain/project'
import { projects, tables, attributes } from '../../storage/repository'
import { addAttribute } from '../../domain/table/addAttribute'
import { getTableAttributes } from '../../read-graphs/attribute'

export { createDimensionTable } from './createDimensionTable'

export function getTableId (req: express.Request) {
  return `${getProjectId(req.params.projectId)}/table/${req.params.tableName}`
}

export async function createFactTable (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  const projectId = getProjectId(req.params.projectId)
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
}

export async function addAttributeHandler (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  const tableId = getTableId(req)
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
    name: variables.name && variables.name.value,
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
}

export async function getAttributes (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  const tableId = getTableId(req)
  getTableAttributes(tableId)
    .then(dataset => {
      res.graph(dataset)
    })
    .catch(next)
}
