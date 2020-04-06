import authHeader from './authentication'
import { Term } from 'rdf-js'
import rdf from 'rdf-ext'
import { ParsingQuery } from 'sparql-http-client/ParsingQuery'
import { getClient } from '../read-graphs/sparqlClient'
import {
  SparqlAskExecutable,
  SparqlGraphQueryExecutable,
  SparqlQueryExecutable,
  SparqlUpdateExecutable,
} from '@tpluscode/sparql-builder/lib'
import DatasetExt from 'rdf-ext/lib/Dataset'
import env from '../env'

export function ask <T> (query: SparqlAskExecutable, client: ParsingQuery = getClient()): Promise<boolean> {
  return query.execute(client, {
    headers: {
      authentication: authHeader,
    },
    base: env.BASE_URI,
  })
}

export function select <T> (query: SparqlQueryExecutable, client: ParsingQuery = getClient()): Promise<Record<string, Term>[]> {
  return query.execute(client, {
    headers: {
      authentication: authHeader,
    },
    base: env.BASE_URI,
  })
}

export async function construct <T> (query: SparqlGraphQueryExecutable, client: ParsingQuery = getClient()): Promise<DatasetExt> {
  const quads = await query.execute(client, {
    headers: {
      authentication: authHeader,
    },
    base: env.BASE_URI,
  })

  return rdf.dataset(quads)
}

export function update <T> (query: SparqlUpdateExecutable, client: ParsingQuery = getClient()): Promise<void> {
  return query.execute(client, {
    headers: {
      authentication: authHeader,
    },
    base: env.BASE_URI,
  })
}
