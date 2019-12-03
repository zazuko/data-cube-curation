import { emitImmediate } from '@tpluscode/fun-ddr/lib/events'
import { Request, Response } from 'express'
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

export const create = asyncMiddleware(async (req: Request, res: Response, next) => {
  const { projectName } = buildVariables(req, {
    projectName: expand('schema:name'),
  })

  const project = await createProject({
    name: projectName.value,
  })
    .commit(projects)

  res.status(201)
  res.setHeader('Location', `${process.env.BASE_URI}${project['@id'].replace('/', '')}`)
  req.resourceId = project['@id']
  await getExistingProject(req, res, next)
})

export const createOrUpdate = asyncMiddleware(async (req: Request, res: Response, next) => {
  const { projectName } = buildVariables(req, {
    projectName: expand('schema:name'),
  })
  let aggregateRoot = await projects.load(req.resourceId)

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

  await aggregateRoot.commit(projects)
  await getExistingProject(req, res, next)
})

export const getFactTable = asyncMiddleware(async (req: Request, res, next) => {
  getFactTableId(req.resourceId)
    .then(value => {
      if (!value) {
        next(new NotFoundError())
        return
      }

      return res.redirect(value, 303)
    })
    .catch(next)
})

export const archive = asyncMiddleware(async (req: Request, res, next) => {
  let aggregateRoot = await projects.load(req.resourceId)

  if (!await aggregateRoot.state) {
    emitImmediate<ProjectEvents, 'ProjectArchived'>(
      req.resourceId,
      'ProjectArchived',
      null
    )
    res.status(404)
    next()
    return
  }

  await aggregateRoot.mutation(archiveProject)(null as never)
    .delete()
    .commit(projects)

  res.status(204)
  next()
})
