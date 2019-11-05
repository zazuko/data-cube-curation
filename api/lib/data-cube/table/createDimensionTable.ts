import express from 'express'
import { getProjectId } from '../project'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import { projects, tables } from '../../storage/repository'
import { NotFoundError } from '../../error'
import { addDimensionTable } from '../../domain/project'
import { asyncRoute } from '../../express'

export const createDimensionTable = asyncRoute(async (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) => {
  const projectId = getProjectId(req.params.projectId)
  const variables = buildVariables(req, {
    identifierTemplate: expand('dataCube:identifierTemplate'),
    source: expand('dataCube:source'),
    name: expand('schema:name'),
  })

  const project = await projects.load(projectId)
  if (!project.state) {
    next(new NotFoundError('Project was not found'))
    return
  }

  const table = await project.factory(addDimensionTable)({
    sourceId: variables.source.value,
    tableName: variables.name.value,
    identifierTemplate: variables.identifierTemplate.value,
  })

  table
    .commit(tables)
    .then(table => {
      res.status(201)
      res.setHeader('Location', `${process.env.BASE_URI}${table['@id']}`)
      next()
    })
    .catch(next)
})
