import { emitImmediate } from '@tpluscode/fun-ddr/lib/events'
import uuid from 'uuid/v4'
import express from 'express'
import asyncMiddleware from 'middleware-async'
import { createProject, renameProject, archiveProject } from '../../domain/project'
import { projects } from '../../storage/repository'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import { getExistingProject } from './get'
import { getFactTableId } from '../../read-graphs/table'
import { NotFoundError } from '../../error'
import { ProjectEvents } from '../../domain/project/events'

export { getTables } from './getTables'

export function getProjectId (projectGuid: string = uuid()) {
  return `${process.env.BASE_URI}project/${projectGuid}`
}

export function initExisting (req, res, next) {
  res.locals.projectId = getProjectId(req.params.projectId)
  next()
}

export function create (req: express.Request, res: express.Response, next: express.NextFunction) {
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

export const createOrUpdate = asyncMiddleware(async (req: express.Request, res: express.Response, next) => {
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

  aggregateRoot = !(await aggregateRoot.state)
    ? createProject(createCommand)
    : aggregateRoot.mutation(renameProject)(renameCommand)

  aggregateRoot.commit(projects)
    .then(() => {
      setTimeout(() => getExistingProject(req, res, next), 50)
    }).catch(next)
})

export const getFactTable = asyncMiddleware(async (req, res, next) => {
  getFactTableId(getProjectId(req.params.projectId))
    .then(value => {
      if (!value) {
        next(new NotFoundError())
        return
      }

      return res.redirect(value, 303)
    })
    .catch(next)
})

export const archive = asyncMiddleware(async (req, res, next) => {
  res.locals.projectId = `/project/${req.params.projectId}`
  let aggregateRoot = await projects.load(res.locals.projectId)

  if (!await aggregateRoot.state) {
    emitImmediate<ProjectEvents, 'ProjectArchived'>(
      res.locals.projectId,
      'ProjectArchived',
      null
    )
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
})
