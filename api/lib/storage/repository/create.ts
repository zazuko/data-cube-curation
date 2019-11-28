import { Entity, Repository } from '@tpluscode/fun-ddr'
import { SparqlGraphRepository } from '@tpluscode/fun-ddr-sparql-graph-repository'
import SparqlHttp from 'sparql-http-client'
import { prefixes, expand } from '@zazuko/rdf-vocabularies'
import rdfFetch from 'hydra-box/lib/rdfFetch'
import authHeader from '../../sparql/authentication'

const base = process.env.BASE_URI
const defaultHeaders: HeadersInit = {}
if (authHeader) {
  defaultHeaders.Authorization = authHeader
}
const sparqlClient = new SparqlHttp({
  endpointUrl: process.env.SPARQL_ENDPOINT,
  updateUrl: process.env.SPARQL_UPDATE_ENDPOINT || process.env.SPARQL_ENDPOINT,
  fetch: rdfFetch,
  defaultHeaders,
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
