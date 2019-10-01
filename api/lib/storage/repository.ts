import rdfFetch from 'hydra-box/lib/rdfFetch'
import SparqlHttp from 'sparql-http-client'
import { SparqlGraphRepository } from '@fun-ddr/sparql-graph-repository'
import { Project } from '../domain/project'
import { Source } from '../domain/source'
import { prefixes, expand } from '@zazuko/rdf-vocabularies'
import { Repository, Entity } from 'fun-ddr/lib'
import { Table } from '../domain/table'

const base = process.env.BASE_URI
const sparqlClient = new SparqlHttp({
  endpointUrl: process.env.SPARQL_ENDPOINT,
  updateUrl: process.env.SPARQL_UPDATE_ENDPOINT || process.env.SPARQL_ENDPOINT,
  fetch: rdfFetch,
})

const context = {
  '@vocab': 'https://rdf-cube-curation.described.at/',
  'schema': prefixes.schema,
  name: 'schema:name',
  archived: { '@id': 'archived', '@type': expand('xsd:boolean') },
}

function createRepository<T extends Entity> (frame: object, specialisedContext?: object): Repository<T> {
  return new SparqlGraphRepository<T>(
    sparqlClient,
    base,
    { ...context, ...specialisedContext },
    frame) as Repository<T>
}

const projectFrame = {
  '@type': 'Project',
}
export const projects = createRepository<Project>(projectFrame)

const sourceContext = {
  columns: 'column',
  project: { '@id': 'project', '@type': '@id' },
}
const sourceFrame = {
  '@type': 'Source',
}
export const sources = createRepository<Source>(sourceFrame, sourceContext)

const tableContext = {
  project: { '@id': 'project', '@type': '@id' },
}
const tableFrame = {
  '@type': 'Table',
}
export const tables = createRepository<Table>(tableFrame, tableContext)
