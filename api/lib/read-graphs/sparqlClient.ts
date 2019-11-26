import rdfFetch from 'hydra-box/lib/rdfFetch'
import SparqlHttp from 'sparql-http-client'
import authHeader from '../sparql/authentication'

const defaultHeaders: HeadersInit = {}
if (authHeader) {
  defaultHeaders.Authorization = authHeader
}

let sparqlClient
export function getClient () {
  sparqlClient = sparqlClient || new SparqlHttp({
    endpointUrl: process.env.READ_MODEL_SPARQL_ENDPOINT,
    updateUrl: process.env.READ_MODEL_SPARQL_UPDATE_ENDPOINT || process.env.READ_MODEL_SPARQL_ENDPOINT,
    fetch: rdfFetch,
    defaultHeaders,
  } as any)

  return sparqlClient
}
