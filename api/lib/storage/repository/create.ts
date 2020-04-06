import { Entity, Repository } from '@tpluscode/fun-ddr'
import { SparqlGraphRepository } from '@tpluscode/fun-ddr-sparql-graph-repository'
import SparqlHttp from 'sparql-http-client/ParsingClient'
import { prefixes, expand } from '@zazuko/rdf-vocabularies'
import authHeader from '../../sparql/authentication'
import env from '../../env'

const base = env.BASE_URI
const headers: HeadersInit = {}
if (authHeader) {
  headers.Authorization = authHeader
}
const sparqlClient = new SparqlHttp({
  endpointUrl: env.SPARQL_ENDPOINT,
  updateUrl: env.SPARQL_UPDATE_ENDPOINT || env.SPARQL_ENDPOINT,
  headers,
})

const context = {
  '@vocab': 'https://rdf-cube-curation.described.at/',
  'schema': prefixes.schema,
  name: 'schema:name',
  archived: { '@id': 'archived', '@type': expand('xsd:boolean') },
}

export function createRepository<T extends Entity> (frame: object, specialisedContext?: object): Repository<T> {
  return new SparqlGraphRepository<T>(
    sparqlClient,
    base,
    { ...context, ...specialisedContext },
    frame) as Repository<T>
}
