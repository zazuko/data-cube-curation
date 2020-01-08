import { NamedNode } from 'rdf-js'
import SparqlHttp, { QueryRequestInit } from 'sparql-http-client'
import debug from 'debug'
import authHeader from './authentication'
import env from '../env'

const logQuery = debug('SPARQL:query')
const logQueryError = logQuery.extend('error')

function buildPrefixes (prefixes: Record<string, (term: string) => NamedNode>) {
  return Object.entries(prefixes)
    .map(p => `PREFIX ${p[0]}: <${p[1]('').value}>`).join('\n')
}

export abstract class Builder<T> {
  private __prefixes = {}
  protected __defaultGraph?: string

  public prefixes (value: Record<string, (term: string) => NamedNode>) {
    this.__prefixes = value

    return this
  }

  public from (defaultGraph: string) {
    this.__defaultGraph = defaultGraph
    return this
  }

  public build () {
    return `
      BASE <${env.BASE_URI}>
      ${buildPrefixes(this.__prefixes)}

      ${this._buildQueryInternal()}`
  }

  public execute (client: SparqlHttp): Promise<T> {
    const query = this.build().trim()

    logQuery('executing %s', query)
    let requestInit
    if (authHeader) {
      requestInit = {
        headers: {
          authorization: authHeader,
        },
      }
    }

    return this._executeInternal(client, query, requestInit)
      .then(this.__checkResponse(query))
      .then(this._getResult)
  }

  protected abstract _executeInternal(client: SparqlHttp, query: string, options: QueryRequestInit): Promise<Response>

  protected abstract _getResult(response: Response): Promise<T>

  protected abstract _buildQueryInternal(): string

  private __checkResponse (query: string) {
    return function assertSuccessfulResponse (response: Response) {
      if (response.ok) {
        return response
      }

      logQueryError('Failed query %s', query)
      throw new Error(response.statusText)
    }
  }
}
