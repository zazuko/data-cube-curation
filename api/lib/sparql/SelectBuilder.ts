import { Term } from 'rdf-js'
import SparqlHttp from 'sparql-http-client'
import { Builder } from './Builder'

export class SelectBuilder extends Builder<Record<string, Term>[]> {
  private __variables: string[] = ['*']
  private __patterns: string[] = []

  public variables (...variables: string[]) {
    this.__variables = variables
    return this
  }

  protected _executeInternal (client: SparqlHttp, query: string) {
    return client.selectQuery(query)
      .then(this._checkResponse)
      .then(response => response.json())
      .then(json => json.results.bindings)
  }

  public where (...patterns: string[]) {
    this.__patterns = [ ...this.__patterns, ...patterns ]

    return this
  }

  protected _buildQueryInternal (): string {
    const variables = this.__variables.map(v => v.replace(/^\??/, '?')).join('')

    return `SELECT ${variables}
      ${this.__defaultGraph ? `FROM <${this.__defaultGraph}>` : ''}
      WHERE {
        ${this.__patterns.join('\n')}
      }`
  }
}
