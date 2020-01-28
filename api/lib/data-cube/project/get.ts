import { Request, Response } from 'express'
import { asyncMiddleware } from 'middleware-async'
import { construct } from '../../sparql'
import { api, dataCube } from '../../namespaces'
import { exists, getProject } from '../../read-graphs/project'

export const placeholderRepresentation = asyncMiddleware(async (req: Request, res: Response) => {
  const placeholderUri = req.resourceId.replace(/\/project/, '/_project')

  const query = construct()
    .prefixes({
      api,
      dataCube,
    })
    .graph(`
      <${placeholderUri}> a api:ProjectPlaceholder ;
        api:project <${req.resourceId}> .
    `)

  res.status(404)
  res.setLink(placeholderUri, 'canonical')
  res.graph(await query.execute(req.sparql))
})

export const getExistingProject = asyncMiddleware(async (req: Request, res: Response) => {
  return res.graph(await getProject(req.resourceId))
})

export const get = asyncMiddleware(async (req: Request, res: Response, next) => {
  if (await exists(req.resourceId) === false) {
    return placeholderRepresentation(req, res, next).catch(next)
  }

  return getExistingProject(req, res, next).catch(next)
})
