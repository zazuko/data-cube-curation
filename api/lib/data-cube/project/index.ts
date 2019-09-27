import uuid from 'uuid/v4'
import express from 'express'
import { createProject, renameProject, archiveProject } from '../../domain/project'
import { projects } from '../../storage/repository'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'

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
      res.setHeader('Location', project['@id'])
      res.locals.projectId = project['@id']
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

  aggregateRoot = !aggregateRoot
    ? createProject(createCommand)
    : aggregateRoot.mutation(renameProject)(renameCommand)

  aggregateRoot.commit(projects).then(() => next()).catch(next)
}

export async function archive (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  res.locals.projectId = `/project/${req.params.projectId}`
  let aggregateRoot = await projects.load(res.locals.projectId)

  aggregateRoot.mutation(archiveProject)()
    .delete()
    .commit(projects)
    .then(() => {
      next()
    })
    .catch(next)
}
