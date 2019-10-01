import express from 'express'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import { getProjectId } from '../project'
import { selectFactTableSource } from '../../domain/project'
import { projects } from '../../storage/repository'
import { getFactTable } from '../../read-graphs/table'

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
    .then(() => next())
    .catch(next)
}

export async function get (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  getFactTable(getProjectId(req.params.projectId))
    .then(value => res.graph(value))
    .catch(next)
}
