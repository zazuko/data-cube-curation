import express from 'express'
import { asyncMiddleware } from 'middleware-async'
import { construct } from '../../sparql'
import { api, dataCube } from '../../namespaces'
import { exists, getProject } from '../../read-graphs/project'

export const placeholderRepresentation = asyncMiddleware(async (req: express.DataCubeRequest, res: express.DataCubeResponse) => {
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

export const getExistingProject = asyncMiddleware(async (req, res: express.DataCubeResponse) => {
  return res.graph(await getProject(res.locals.projectId))
})

export const get = asyncMiddleware(async (req, res, next) => {
  res.locals.projectId = res.locals.projectId || `/project/${req.params.projectId}`

  if (await exists(res.locals.projectId) === false) {
    return placeholderRepresentation(req, res, next).catch(next)
  }

  return getExistingProject(req, res, next).catch(next)
})
