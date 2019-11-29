import { Request, Response } from 'express'
import asyncMiddleware from 'middleware-async'
import { createProject, renameProject, archiveProject } from '../../domain/project'
import { projects } from '../../storage/repository'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import { getExistingProject } from './get'
import { getFactTableId } from '../../read-graphs/table'
import { NotFoundError } from '../../error'

export { getTables } from './getTables'

export function create (req: Request, res: Response, next) {
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

  aggregateRoot.commit(projects)
    .then(() => {
      setTimeout(() => getExistingProject(req, res, next), 50)
    }).catch(next)
})

export const getFactTable = asyncMiddleware(async (req: Request, res, next) => {
  const projectId = req.resourceId.replace(/\/fact-table$/, '')
  getFactTableId(projectId)
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
})
