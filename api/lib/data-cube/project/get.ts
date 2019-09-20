import express from 'express'
import { ask, construct } from '../../sparql'
import { api, dataCube, hydra, schema } from '../../namespaces'

async function placeholderRepresentation (req: express.DataCubeRequest, res: express.DataCubeResponse) {
  const placeholderUri = res.locals.projectId.replace(/\/project/, '/_project')

  const query = construct()
    .prefixes({
      api,
      dataCube,
    })
    .graph(`
      <${placeholderUri}> a api:ProjectPlaceholder ;
        api:project <${res.locals.projectId}> .
    `)

  res.setLink(placeholderUri, 'canonical')
  res.graph(await query.execute(req.sparql))
}

async function getExistingProject (req: express.DataCubeRequest, res: express.DataCubeResponse) {
  const query = construct()
    .prefixes({
      api,
      dataCube,
      schema,
      hydra,
    })
    .from(res.locals.projectId)
    .graph(`
    ?project a ?projectType ;
      schema:name ?name ;
      api:sources ?sources ;
      dataCube:factTable ?factTable .

    ?sources
        a hydra:Collection ;
        hydra:member ?source ;
        hydra:totalItems ?count .

    ?source schema:name ?sourceName`)
    .where(`
    BIND (<${res.locals.projectId}> as ?project)
    BIND (<${res.locals.projectId}/sources> as ?sources)
    BIND (<${res.locals.projectId}/fact-table> as ?factTable)

    ?project
        schema:name ?name ;
        a ?projectType .

    OPTIONAL
    {
        ?project dataCube:source ?source .
        ?source schema:name ?sourceName .
    }

    {
        SELECT (COUNT(?source) as ?count)
        {
            OPTIONAL { ?project dataCube:source ?source }
        }
}`)

  res.graph(await query.execute(req.sparql))
}

export async function get (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  const projectExistsQuery = ask(`GRAPH <${res.locals.projectId}> { ?s ?p ?o }`)

  if (await projectExistsQuery.execute(req.sparql) === false) {
    return placeholderRepresentation(req, res).catch(next)
  }

  return getExistingProject(req, res).catch(next)
}
