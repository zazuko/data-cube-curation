import { NamedNode } from 'rdf-js'
import SparqlHttp from 'sparql-http-client'

function buildPrefixes (prefixes: Record<string, (term: string) => NamedNode>) {
  return Object.entries(prefixes)
    .map(p => `PREFIX ${p[0]}: <${p[1]('').value}>`).join('\n')
}

export abstract class Builder<T> {
  private __prefixes = {}
  protected __defaultGraph?: string
  private __insertPatterns: string[] = []

  public prefixes (value: Record<string, (term: string) => NamedNode>) {
    this.__prefixes = value

    return this
  }

  public from (defaultGraph: string) {
    this.__defaultGraph = defaultGraph
    return this
  }

  public insert (...patterns: string[]) {
    this.__insertPatterns = [ ...this.__insertPatterns, ...patterns ]
    return this
  }

  public build () {
    return `
      BASE <${process.env.BASE_URI}>
      ${buildPrefixes(this.__prefixes)}
      
      ${this._buildQueryInternal()}`
  }

  public execute (client: SparqlHttp) {
    const query = this.build()

    console.log(query)

    return this._executeInternal(client, query)
  }

  protected abstract _executeInternal(client: SparqlHttp, query: string): Promise<T>

  protected abstract _buildQueryInternal(): string

  protected _checkResponse<T extends Response> (response: T) {
    if (response.ok) {
      return response
    }

    throw new Error(response.statusText)
  }
}
