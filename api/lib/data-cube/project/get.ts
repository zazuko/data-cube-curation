import { Request, Response } from 'express'
import { asyncMiddleware } from 'middleware-async'
import { construct } from '../../sparql'
import { api, dataCube } from '../../namespaces'
import { exists, getProject } from '../../read-graphs/project'

export const placeholderRepresentation = asyncMiddleware(async (req: Request, res: Response) => {
  const placeholderUri = res.locals.projectId.replace(/\/project/, '/_project')

  const query = construct()
    .prefixes({
      api,
      dataCube,
    })
    .graph(`
      <${placeholderUri}> a api:ProjectPlaceholder ;
        api:project </project/${req.params.projectId}> .
    `)

  res.setLink(placeholderUri, 'canonical')
  res.graph(await query.execute(req.sparql))
})

export const getExistingProject = asyncMiddleware(async (req: Request, res: Response) => {
  return res.graph(await getProject(res.locals.projectId))
})

export const get = asyncMiddleware(async (req: Request, res: Response, next) => {
  res.locals.projectId = res.locals.projectId || `/project/${req.params.projectId}`

  if (await exists(res.locals.projectId) === false) {
    return placeholderRepresentation(req, res, next).catch(next)
  }

  return getExistingProject(req, res, next).catch(next)
})
