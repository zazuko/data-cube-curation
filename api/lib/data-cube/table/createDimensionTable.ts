import express from 'express'
import { asyncMiddleware } from 'middleware-async'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import { projects, tables } from '../../storage/repository'
import { NotFoundError } from '../../error'
import { addDimensionTable, selectFactTableSource } from '../../domain/project'
import { DomainError } from '@tpluscode/fun-ddr'
import { getProjectId } from '../../read-graphs/project/links'
import { getRepresentation } from '../../read-graphs/table/index'
import env from '../../env'

async function loadProject (projectId: string) {
  const project = await projects.load(projectId)
  if (!project.state) {
    throw new NotFoundError('Project was not found')
  }

  return project
}

async function createDimensionTable (req: express.Request, projectId: string): Promise<string> {
  const variables = buildVariables(req, {
    identifierTemplate: expand('dataCube:identifierTemplate'),
    source: expand('dataCube:source'),
    name: expand('schema:name'),
  })

  const project = await loadProject(projectId)
  const table = await project.factory(addDimensionTable)({
    sourceId: variables.source.value,
    tableName: variables.name.value,
    identifierTemplate: variables.identifierTemplate.value,
  })

  const tableAggregate = await table
    .commit(tables)

  return `${env.BASE_URI}${tableAggregate['@id']}`
}

async function createFactTable (req: express.Request, projectId: string) {
  const { sourceId, tableName, identifierTemplate } = buildVariables(req, {
    sourceId: expand('dataCube:source'),
    tableName: expand('schema:name'),
    identifierTemplate: expand('dataCube:identifierTemplate'),
  })

  const project = await loadProject(projectId)
  await project.mutation(selectFactTableSource)({
    sourceId: sourceId.value,
    tableName: tableName.value,
    identifierTemplate: identifierTemplate.value || null,
  })
    .commit(projects)

  return `${projectId}/table/${tableName.value}`
}

export const createTable = asyncMiddleware(async (req: express.Request, res: express.Response) => {
  const projectId = await getProjectId(req.resourceId)
  if (!projectId) {
    throw new NotFoundError()
  }

  const { type } = buildVariables(req, {
    type: expand('rdf:type'),
  })

  let tableId
  if (type.value === expand('dataCube:DimensionTable')) {
    tableId = await createDimensionTable(req, projectId)
  } else if (type.value === expand('dataCube:FactTable')) {
    tableId = await createFactTable(req, projectId)
  } else {
    throw new DomainError(projectId, 'Cannot create table', 'Missing or unrecognized table type')
  }

  res.status(201)
  res.setHeader('Location', tableId)
  res.graph(await getRepresentation(tableId))
})
