import rdfFetch from 'hydra-box/lib/rdfFetch'
import SparqlHttp from 'sparql-http-client'
import { SparqlRepository } from '../ddd/GraphRepository'
import { Project, Source } from '../domain/project'
import { prefixes } from '@zazuko/rdf-vocabularies'

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
}

const projectFrame = {
  '@type': 'Project',
}
export const projects = new SparqlRepository<Project>(sparqlClient, base, context, projectFrame)

const sourceContext = {
  columns: 'column',
  project: { '@id': 'project', '@type': '@id' },
}
const sourceFrame = {
  '@type': 'Source',
}
export const sources = new SparqlRepository<Source>(sparqlClient, base, { ...context, ...sourceContext }, sourceFrame)
