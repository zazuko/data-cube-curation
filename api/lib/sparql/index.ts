/* eslint-disable import/export */
import authHeader from './authentication'
import { Quad, Term } from 'rdf-js'
import rdf from 'rdf-ext'
import { getClient } from '../read-graphs/sparqlClient'
import {
  SparqlAskExecutable,
  SparqlGraphQueryExecutable,
  SparqlQueryExecutable,
  SparqlUpdateExecutable,
} from '@tpluscode/sparql-builder/lib'
import DatasetExt from 'rdf-ext/lib/Dataset'
import env from '../env'
import debug from 'debug'

const log = debug('SPARQL:query')
const sparqlOptions = {
  headers: {
    authentication: authHeader,
  },
  base: env.BASE_URI,
}

export function execute (query: SparqlAskExecutable): Promise<boolean>
export function execute (query: SparqlUpdateExecutable): Promise<void>
export function execute (query: SparqlQueryExecutable): Promise<readonly Record<string, Term>[]>
export function execute (query: SparqlGraphQueryExecutable): Promise<Quad[]>
export function execute (query) {
  if (log.enabled) {
    log(query.build(sparqlOptions))
  }

  return query.execute(getClient(), sparqlOptions)
}

export function ask <T> (query: SparqlAskExecutable): Promise<boolean> {
  return execute(query)
}

export function select <T> (query: SparqlQueryExecutable): Promise<readonly Record<string, Term>[]> {
  return execute(query)
}

export async function construct <T> (query: SparqlGraphQueryExecutable): Promise<DatasetExt> {
  const quads = await execute(query)

  return rdf.dataset(quads)
}

export function update <T> (query: SparqlUpdateExecutable): Promise<void> {
  return execute(query)
}
