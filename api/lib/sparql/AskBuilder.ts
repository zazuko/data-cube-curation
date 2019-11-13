import SparqlHttp from 'sparql-http-client'
import { Builder } from './Builder'

export class AskBuilder extends Builder<boolean> {
  private __patterns: string[] = []

  public _executeInternal (client: SparqlHttp, query: string, options) {
    return client.selectQuery(query, options)
      .then(this._checkResponse)
      .then(response => response.json())
      .then(json => json.boolean)
  }

  public where (...patterns: string[]) {
    this.__patterns = [ ...this.__patterns, ...patterns ]

    return this
  }

  protected _buildQueryInternal () {
    return `ASK {
      ${this.__patterns.join('\n')}
    }`
  }
}
