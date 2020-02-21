import rdfFetch from 'hydra-box/lib/rdfFetch'
import { RdfFetchResponse } from '@rdfjs/fetch-lite'
import SparqlHttp, { SparqlHttpClient } from 'sparql-http-client'
import authHeader from '../sparql/authentication'
import env from '../env'

const defaultHeaders: HeadersInit = {}
if (authHeader) {
  defaultHeaders.Authorization = authHeader
}

let sparqlClient
export function getClient (): SparqlHttpClient<RdfFetchResponse> {
  sparqlClient = sparqlClient || new SparqlHttp({
    endpointUrl: env.READ_MODEL_SPARQL_ENDPOINT,
    updateUrl: env.READ_MODEL_SPARQL_UPDATE_ENDPOINT || env.READ_MODEL_SPARQL_ENDPOINT,
    fetch: rdfFetch,
    defaultHeaders,
  })

  return sparqlClient
}
