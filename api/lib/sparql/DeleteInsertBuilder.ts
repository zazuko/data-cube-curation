import SparqlHttp from 'sparql-http-client'
import { Builder } from './Builder'

export class DeleteInsertBuilder extends Builder<Response> {
  private __patterns: string[] = []
  private __deleteGraph: string[] = []
  private __insertGraph: string[] = []

  protected _executeInternal(client: SparqlHttp, query: string) {
    return client.updateQuery(query)
      .then(this._checkResponse)
  }

  public delete(...graph: string[]) {
    this.__deleteGraph = [ ...this.__deleteGraph, ...graph ]

    return this
  }

  public insert(...graph: string[]) {
    this.__insertGraph = [ ...this.__insertGraph, ...graph ]

    return this
  }

  public where(...patterns: string[]) {
    this.__patterns = [ ...this.__patterns, ...patterns ]

    return this
  }

  protected _buildQueryInternal() {
    let where = this.__patterns
    if (where.length === 0) {
      where = this.__deleteGraph
    }

    return `
      DELETE {
        ${this.__deleteGraph.join('\n')}
      }
      INSERT {
        ${this.__insertGraph.join('\n')}
      }
      WHERE {
        ${where.join('\n')}
      }
    `
  }
}
