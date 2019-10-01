import uuid from 'uuid/v4'
import express from 'express'
import { createProject, renameProject, archiveProject } from '../../domain/project'
import { projects } from '../../storage/repository'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import { getExistingProject } from './get'
import { getFactTableId } from '../../read-graphs/table'

export function getProjectId (projectGuid: string = uuid()) {
  return `${process.env.BASE_URI}project/${projectGuid}`
}

export function initExisting (req, res, next) {
  res.locals.projectId = getProjectId(req.params.projectId)
  next()
}

export function create (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  const { projectName } = buildVariables(req, {
    projectName: expand('schema:name'),
  })

  createProject({
    name: projectName.value,
  })
    .commit(projects)
    .then((project) => {
      res.status(201)
      res.setHeader('Location', `${process.env.BASE_URI}${project['@id'].replace('/', '')}`)
      next()
    })
    .catch(next)
}

export async function createOrUpdate (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  const { projectName } = buildVariables(req, {
    projectName: expand('schema:name'),
  })
  res.locals.projectId = `/project/${req.params.projectId}`
  let aggregateRoot = await projects.load(res.locals.projectId)

  const renameCommand = {
    newName: projectName.value,
  }
  const createCommand = {
    name: projectName.value,
    uriSlug: req.params.projectId,
  }

  aggregateRoot = !aggregateRoot.state
    ? createProject(createCommand)
    : aggregateRoot.mutation(renameProject)(renameCommand)

  aggregateRoot.commit(projects)
    .then(() => {
      setTimeout(() => getExistingProject(req, res), 50)
    }).catch(next)
}

export async function getFactTable (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  getFactTableId(getProjectId(req.params.projectId))
    .then(value => res.redirect(value, 303))
    .catch(next)
}

export async function archive (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  res.locals.projectId = `/project/${req.params.projectId}`
  let aggregateRoot = await projects.load(res.locals.projectId)

  if (!aggregateRoot.state) {
    res.status(404)
    next()
    return
  }

  aggregateRoot.mutation(archiveProject)(null as never)
    .delete()
    .commit(projects)
    .then(() => {
      res.status(204)
      next()
    })
    .catch(next)
}
