import rdfFetch from 'hydra-box/lib/rdfFetch'
import SparqlHttp from 'sparql-http-client'

let sparqlClient
export function getClient () {
  sparqlClient = sparqlClient || new SparqlHttp({
    endpointUrl: process.env.READ_MODEL_SPARQL_ENDPOINT,
    updateUrl: process.env.READ_MODEL_SPARQL_UPDATE_ENDPOINT || process.env.READ_MODEL_SPARQL_ENDPOINT,
    fetch: rdfFetch,
  })

  return sparqlClient
}
