import express from 'express'
import { construct } from '../../sparql'
import { api, dataCube } from '../../namespaces'
import { exists, getProject } from '../../read-graphs/project'

async function placeholderRepresentation(req: express.DataCubeRequest, res: express.DataCubeResponse) {
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
}

export async function getExistingProject(req: express.DataCubeRequest, res: express.DataCubeResponse) {
  return res.graph(await getProject(res.locals.projectId))
}

export async function get(req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  res.locals.projectId = res.locals.projectId || `/project/${req.params.projectId}`

  if (await exists(res.locals.projectId) === false) {
    return placeholderRepresentation(req, res).catch(next)
  }

  return getExistingProject(req, res).catch(next)
}
