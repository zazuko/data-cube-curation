import { Request, Response } from 'express'
import { asyncMiddleware } from 'middleware-async'
import { CONSTRUCT } from '@tpluscode/sparql-builder'
import { construct } from '../../sparql'
import { namedNode } from '@rdfjs/data-model'
import { api } from '../../namespaces'
import { exists, getProject } from '../../read-graphs/project'

export const placeholderRepresentation = asyncMiddleware(async (req: Request, res: Response) => {
  const placeholder = namedNode(req.resourceId.replace(/\/project/, '/_project'))

  const query = CONSTRUCT`
      ${placeholder} a ${api.ProjectPlaceholder} ;
        ${api.project} ${req.resourceNode} .
    `
  res.status(404)
  res.setLink(placeholder.value, 'canonical')
  res.graph(await construct(query))
})

export const getExistingProject = asyncMiddleware(async (req: Request, res: Response) => {
  return res.representation(await getProject(req.resourceId))
})

export const get = asyncMiddleware(async (req: Request, res: Response, next) => {
  if (await exists(req.resourceId) === false) {
    return placeholderRepresentation(req, res, next).catch(next)
  }

  return getExistingProject(req, res, next).catch(next)
})
