import { Request, Response } from 'express'
import asyncMiddleware from 'middleware-async'
import { ProjectMixin } from '@zazuko/rdfine-data-cube/Project'
import { Project } from '@zazuko/rdfine-data-cube'
import { createProject, updateProject } from '../../domain/project'
import { projects } from '../../storage/repository'
import { getFactTableId } from '../../read-graphs/table'
import { NotFoundError } from '../../error'
import { getProject } from '../../read-graphs/project'
import env from '../../env'

export { getTables } from './getTables'

export const create = asyncMiddleware(async (req: Request, res: Response) => {
  const projectRepresentation = req.buildModel<Project>([ProjectMixin])[0]

  const project = await createProject(projectRepresentation).commit(projects)

  res.status(201)
  res.setHeader('Location', `${env.BASE_URI}${project['@id'].replace('/', '')}`)
  res.representation(await getProject(project['@id']))
})

export const createOrUpdate = asyncMiddleware(async (req: Request, res: Response) => {
  const projectRepresentation = req.buildModel<Project>([ProjectMixin])[0]
  let aggregateRoot = await projects.load(req.resourceId)

  const createCommand = {
    name: projectRepresentation.name,
    uriSlug: req.params.projectId,
    baseUri: projectRepresentation.baseUri,
  }

  aggregateRoot = !(await aggregateRoot.state)
    ? createProject(createCommand)
    : aggregateRoot.mutation(updateProject)(projectRepresentation)

  await aggregateRoot.commit(projects)
  res.representation(await getProject(req.resourceId))
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
