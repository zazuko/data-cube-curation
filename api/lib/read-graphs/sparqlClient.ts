import { ParsingQuery } from 'sparql-http-client/ParsingQuery'
import ParsingClient from 'sparql-http-client/ParsingClient'
import authHeader from '../sparql/authentication'
import env from '../env'

const headers: HeadersInit = {}
if (authHeader) {
  headers.Authorization = authHeader
}

let sparqlClient: ParsingClient
export function getClient (): ParsingQuery {
  sparqlClient = sparqlClient || new ParsingClient({
    endpointUrl: env.READ_MODEL_SPARQL_ENDPOINT,
    updateUrl: env.READ_MODEL_SPARQL_UPDATE_ENDPOINT || env.READ_MODEL_SPARQL_ENDPOINT,
    headers,
  })

  return sparqlClient.query
}
