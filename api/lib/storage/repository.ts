import rdfFetch from 'hydra-box/lib/rdfFetch'
import SparqlHttp from 'sparql-http-client'
import { SparqlGraphRepository } from '@fun-ddr/sparql-graph-repository'
import { Project } from '../domain/project'
import { Source } from '../domain/source'
import { prefixes, expand } from '@zazuko/rdf-vocabularies'
import { Repository } from 'fun-ddr/lib'

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

const projectFrame = {
  '@type': 'Project',
}
export const projects = new SparqlGraphRepository<Project>(sparqlClient, base, context, projectFrame) as Repository<Project>

const sourceContext = {
  columns: 'column',
  project: { '@id': 'project', '@type': '@id' },
}
const sourceFrame = {
  '@type': 'Source',
}
export const sources = new SparqlGraphRepository<Source>(sparqlClient, base, { ...context, ...sourceContext }, sourceFrame) as Repository<Source>
