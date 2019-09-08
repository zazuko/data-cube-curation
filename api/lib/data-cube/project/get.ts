import express from 'express'
import { ask, construct } from '../../sparql'
import { api, dataCube, hydra, schema } from '../../namespaces'

async function placeholderRepresentation (req: express.DataCubeRequest, res: express.DataCubeResponse) {
  const placeholderUri = res.locals.projectId.replace(/\/project/, '/_project')

  const quads = await construct(req.sparql,
    {
      api,
      dataCube,
    },
    `
      <${placeholderUri}> a api:ProjectPlaceholder ;
        api:project <${res.locals.projectId}> .
    `)

  res.setLink(placeholderUri, 'canonical')
  res.graph(quads)
}

async function getExistingProject (req: express.DataCubeRequest, res: express.DataCubeResponse) {
  const quads = await construct(req.sparql,
    {
      api,
      dataCube,
      schema,
      hydra,
    },
    `
    ?project a ?projectType ;
      schema:name ?name ;
      api:sources ?sources ;
      dataCube:factTable ?factTable .

    ?sources
        a hydra:Collection ;
        hydra:member ?source ;
        hydra:totalItems ?count .

    ?source schema:name ?sourceName`,
    `
GRAPH <${res.locals.projectId}> {
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
            BIND (<${res.locals.projectId}> as ?project)
            BIND (<${res.locals.projectId}/sources> as ?sources)

            OPTIONAL { ?project dataCube:source ?source }
        }
    }
}`)

  res.graph(quads)
}

export async function get (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  if (await ask(req.sparql, `GRAPH <${res.locals.projectId}> { ?s ?p ?o }`) === false) {
    return placeholderRepresentation(req, res).catch(next)
  }

  return getExistingProject(req, res).catch(next)
}
