/* eslint-disable import/export */
import { Stream } from 'rdf-js'
import { RdfFetchResponse } from '@rdfjs/fetch-lite'
import authHeader from './authentication'
import { SparqlHttpClient } from 'sparql-http-client'
import { SparqlQuery } from '@tpluscode/sparql-builder/lib'
import { getClient } from '../read-graphs/sparqlClient'

export function execute (query: SparqlQuery<Response>, client?: SparqlHttpClient): Promise<Stream>
export function execute <T>(query: SparqlQuery<T>, client?: SparqlHttpClient): Promise<T>
export async function execute <T> (query: SparqlQuery<T | RdfFetchResponse>, client: SparqlHttpClient = getClient()) {
  const result = await query.execute(client, {
    headers: {
      authentication: authHeader,
    },
  })

  if (result instanceof Response) {
    return result.quadStream()
  }

  return result
}
