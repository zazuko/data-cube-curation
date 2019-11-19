import express from 'express'
import { asyncMiddleware } from 'middleware-async'
import { getProjectId } from '../project'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import { projects, tables } from '../../storage/repository'
import { NotFoundError } from '../../error'
import { addDimensionTable, selectFactTableSource } from '../../domain/project'
import { DomainError } from '@tpluscode/fun-ddr'

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

  return table
    .commit(tables)
    .then(created => `${process.env.BASE_URI}${created['@id']}`)
}

async function createFactTable (req: express.Request, projectId: string) {
  const { sourceId, tableName } = buildVariables(req, {
    sourceId: expand('dataCube:source'),
    tableName: expand('schema:name'),
  })

  const project = await loadProject(projectId)
  return project.mutation(selectFactTableSource)({
    sourceId: sourceId.value,
    tableName: tableName.value,
  })
    .commit(projects)
    .then(() => `${projectId}/table/${tableName.value}`)
}

export const createTable = asyncMiddleware(async (req: express.Request, res, next) => {
  let promiseTable: Promise<string>
  const projectId = getProjectId(req.params.projectId)
  const { type } = buildVariables(req, {
    type: expand('rdf:type'),
  })

  if (type.value === expand('dataCube:DimensionTable')) {
    promiseTable = createDimensionTable(req, projectId)
  } else if (type.value === expand('dataCube:FactTable')) {
    promiseTable = createFactTable(req, projectId)
  } else {
    throw new DomainError(projectId, 'Cannot create table', 'Missing or unrecognized table type')
  }

  promiseTable
    .then(tableId => {
      res.status(201)
      res.setHeader('Location', tableId)
      next()
    })
    .catch(next)
})
