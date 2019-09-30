import { NamedNode } from 'rdf-js'
import SparqlHttp from 'sparql-http-client'

function buildPrefixes (prefixes: Record<string, (term: string) => NamedNode>) {
  return Object.entries(prefixes)
    .map(p => `PREFIX ${p[0]}: <${p[1]('').value}>`).join('\n')
}

function checkResponse<T extends Response> (response: T) {
  if (response.ok) {
    return response
  }

  throw new Error(response.statusText)
}

type QueryKind = 'SELECT' | 'CONSTRUCT' | 'DELETE' | 'ASK' | 'INSERT DATA'

export class Builder {
  private __prefixes = {}
  private __defaultGraph?: string
  private __variables: string[] = ['*']
  private __patterns: string[] = []
  private __constructGraph: string[] = []
  private __insertPatterns: string[] = []
  private readonly __kind: QueryKind

  public constructor (kind: QueryKind) {
    this.__kind = kind
  }

  public prefixes (value: Record<string, (term: string) => NamedNode>) {
    this.__prefixes = value

    return this
  }

  public from (defaultGraph: string) {
    this.__defaultGraph = defaultGraph
    return this
  }

  public variables (...variables: string[]) {
    this.__variables = variables
    return this
  }

  public graph (...graph: string[]) {
    this.__constructGraph = [ ...this.__constructGraph, ...graph ]

    return this
  }

  public where (...patterns: string[]) {
    this.__patterns = [ ...this.__patterns, ...patterns ]

    return this
  }

  public insert (...patterns: string[]) {
    this.__insertPatterns = [ ...this.__insertPatterns, ...patterns ]
    return this
  }

  public build () {
    let graphOrVariables
    let patterns = ''
    let noPatterns = false

    switch (this.__kind) {
      case 'SELECT':
        graphOrVariables = this.__variables.map(v => v.replace(/^\??/, '?')).join('')
        break
      case 'CONSTRUCT':
        graphOrVariables = `{
          ${this.__constructGraph.join('\n')}
        }`
        break
      case 'INSERT DATA':
        noPatterns = true
        graphOrVariables = `{
          ${this.__constructGraph.join('\n')}
        }`
        break
      case 'DELETE':
        return this.__buildDeleteInsert()
      default:
        graphOrVariables = ''
    }

    if (!noPatterns) {
      patterns = `WHERE {
        ${this.__patterns.join('\n')}
      }`
    }

    return `
      BASE <${process.env.BASE_URI}>
      ${buildPrefixes(this.__prefixes)}
      
      ${this.__kind} ${graphOrVariables}
      ${this.__defaultGraph ? `FROM <${this.__defaultGraph}>` : ''}
      ${patterns}`
  }

  private __buildDeleteInsert () {
    let where = this.__patterns
    if (where.length === 0) {
      where = this.__constructGraph
    }

    return `
      BASE <${process.env.BASE_URI}>
      ${buildPrefixes(this.__prefixes)}
      
      DELETE {
        ${this.__constructGraph.join('\n')}
      }
      INSERT {
        ${this.__insertPatterns.join('\n')}
      }
      WHERE {
        ${where.join('\n')}
      }
    `
  }

  public execute (client: SparqlHttp): Promise<any> {
    const query = this.build()

    console.log(query)

    if (this.__kind === 'INSERT DATA' || this.__kind === 'DELETE') {
      return client.updateQuery(query)
        .then(checkResponse)
    }

    if (this.__kind === 'CONSTRUCT') {
      return client.constructQuery(query)
        .then(checkResponse)
        .then(response => response.quadStream())
    }

    if (this.__kind === 'ASK') {
      return client.selectQuery(query)
        .then(checkResponse)
        .then(response => response.json())
        .then(json => json.boolean)
    }

    return client.selectQuery(query)
      .then(checkResponse)
      .then(response => response.json())
      .then(json => json.results.bindings)
  }
}
