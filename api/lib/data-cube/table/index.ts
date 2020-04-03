import express from 'express'
import asyncMiddleware from 'middleware-async'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import { selectFactTableSource } from '../../domain/project'
import { projects } from '../../storage/repository'
import { NotFoundError } from '../../error'
import { getProjectId } from '../../read-graphs/project/links'
import { getRepresentation } from '../../read-graphs/table/index'
import { getFactTableId } from '../../read-graphs/table'
import { canonicalFactTableId } from '../project'

export { get } from './get'
export { update } from './update'
export { createTable } from './createDimensionTable'
export { archive } from './archive'
export { addAttributeHandler, getAttributes } from './attributes'

export const createFactTable = asyncMiddleware(async (req: express.Request, res: express.Response) => {
  const projectId = await getProjectId(req.resourceId)
  if (!projectId) {
    throw new NotFoundError()
  }

  const variables = buildVariables(req, {
    source: expand('dataCube:source'),
    name: expand('schema:name'),
    identifierTemplate: expand('dataCube:identifierTemplate'),
  })

  const project = await projects.load(projectId)
  if (!project.state) {
    res.status(404)
    res.end()
    return
  }

  await project.mutation(selectFactTableSource)({
    sourceId: variables.source.value,
    tableName: variables.name.value,
    identifierTemplate: variables.identifierTemplate.value,
  })
    .commit(projects)

  const tableId = await getFactTableId(canonicalFactTableId(projectId))
  if (!tableId) {
    throw new Error('Could not find the fact table id. Was it created successfully?')
  }

  res.status(201)
  res.setHeader('Location', tableId)
  res.graph(await getRepresentation(tableId))
})
