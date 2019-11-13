import SparqlHttp from 'sparql-http-client'
import { Builder } from './Builder'

export class ConstructBuilder extends Builder<any> {
  private __constructGraph: string[] = []
  private __patterns: string[] = []

  public graph (...graph: string[]) {
    this.__constructGraph = [ ...this.__constructGraph, ...graph ]

    return this
  }

  public where (...patterns: string[]) {
    this.__patterns = [ ...this.__patterns, ...patterns ]

    return this
  }

  public _executeInternal (client: SparqlHttp, query: string, options) {
    return client.constructQuery(query, options)
      .then(r => this._checkResponse<any>(r))
      .then(response => response.quadStream())
  }

  protected _buildQueryInternal () {
    return `CONSTRUCT {
       ${this.__constructGraph.join('\n')}
    }
    WHERE {
       ${this.__patterns.join('\n')}
    }`
  }
}
