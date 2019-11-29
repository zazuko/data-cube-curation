import express from 'express'
import asyncMiddleware from 'middleware-async'
import { ask, construct } from '../../sparql'
import { getClient } from '../../read-graphs/sparqlClient'
import { NotFoundError } from '../../error'
import { api, dataCube } from '../../namespaces'

export const get = asyncMiddleware(async (req: express.Request, res: express.Response) => {
  const tableId = req.resourceId
  const tableExists = await ask(`<${tableId}> a dataCube:Table`)
    .prefixes({ dataCube })
    .execute(getClient())

  if (!tableExists) {
    throw new NotFoundError()
  }

  const quadStream = await construct()
    .graph(`
      ?table ?p ?o .
      ?table api:attributes ?attributes .
      ?table api:preview ?preview .
      ?table api:csvwMetadata ?csvw .
    `)
    .where(`
    BIND (<${tableId}> as ?table)
    BIND (<${tableId}/attributes> as ?attributes)
    BIND (<${tableId}/preview> as ?preview)
    BIND (<${tableId}/csvw> as ?csvw)

    ?table
        a dataCube:Table ;
        ?p ?o .`)
    .prefixes({ dataCube, api })
    .execute(getClient())

  res.graph(quadStream)
})
