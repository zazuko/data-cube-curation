import { ask, construct } from '../../sparql'
import { api, dataCube } from '../../namespaces'
import { getClient } from '../sparqlClient'
import { NotFoundError } from '../../error'

export async function getRepresentation (tableId: string) {
  const tableExists = await ask(`<${tableId}> a dataCube:Table`)
    .prefixes({ dataCube })
    .execute(getClient())

  if (!tableExists) {
    throw new NotFoundError()
  }

  return construct()
    .graph(`
      ?table ?p ?o .
    `)
    .where(`
    BIND (<${tableId}> as ?table)

    ?table
        a dataCube:Table ;
        ?p ?o .`)
    .prefixes({ dataCube, api })
    .execute(getClient())
}
