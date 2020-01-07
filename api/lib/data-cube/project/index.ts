import { Request, Response } from 'express'
import asyncMiddleware from 'middleware-async'
import { createProject, updateProject } from '../../domain/project'
import { projects } from '../../storage/repository'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import { getFactTableId } from '../../read-graphs/table'
import { NotFoundError } from '../../error'
import { getProject } from '../../read-graphs/project'
import env from '../../env'

export { getTables } from './getTables'

export const create = asyncMiddleware(async (req: Request, res: Response) => {
  const { projectName, baseUri } = buildVariables(req, {
    projectName: expand('schema:name'),
    baseUri: expand('dataCube:baseUri'),
  })

  const project = await createProject({
    name: projectName.value,
    baseUri: baseUri.value,
  })
    .commit(projects())

  res.status(201)
  res.setHeader('Location', `${env.BASE_URI}${project['@id'].replace('/', '')}`)
  res.graph(await getProject(project['@id']))
})

export const createOrUpdate = asyncMiddleware(async (req: Request, res: Response) => {
  const { projectName, baseUri } = buildVariables(req, {
    projectName: expand('schema:name'),
    baseUri: expand('dataCube:baseUri'),
  })
  let aggregateRoot = await projects().load(req.resourceId)

  const updateCommand = {
    newName: projectName.value,
    baseUri: baseUri.value,
  }
  const createCommand = {
    name: projectName.value,
    uriSlug: req.params.projectId,
    baseUri: baseUri.value,
  }

  aggregateRoot = !(await aggregateRoot.state)
    ? createProject(createCommand)
    : aggregateRoot.mutation(updateProject)(updateCommand)

  await aggregateRoot.commit(projects())
  res.graph(await getProject(req.resourceId))
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
