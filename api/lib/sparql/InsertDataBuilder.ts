import SparqlHttp from 'sparql-http-client'
import { Builder } from './Builder'

export class InsertDataBuilder extends Builder<Response> {
  private __data: string[] = []

  protected _executeInternal (client: SparqlHttp, query: string) {
    return client.updateQuery(query)
      .then(this._checkResponse)
  }

  public graph (...graph: string[]) {
    this.__data = [ ...this.__data, ...graph ]

    return this
  }

  protected _buildQueryInternal () {
    return `INSERT DATA {
      ${this.__data.join('\n')}
    }`
  }
}
