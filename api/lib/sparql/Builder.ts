import { NamedNode } from 'rdf-js'

function buildPrefixes (prefixes: Record<string, (term: string) => NamedNode>) {
  return Object.entries(prefixes)
    .map(p => `PREFIX ${p[0]}: <${p[1]('').value}>`).join('\n')
}

function checkResponse (response: Response) {
  if (response.ok) {
    return response
  }

  throw new Error(response.statusText)
}

type QueryKind = 'SELECT' | 'CONSTRUCT' | 'DELETE' | 'ASK'

export class Builder {
  private __prefixes = {}
  private __variables: string[] = ['*']
  private __patterns: string[] = []
  private __constructGraph: string[] = []
  private readonly __kind: QueryKind

  public constructor (kind: QueryKind) {
    this.__kind = kind
  }

  public prefixes (value: Record<string, (term: string) => NamedNode>) {
    this.__prefixes = value

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

  public build () {
    let graphOrVariables

    switch (this.__kind) {
      case 'SELECT':
        graphOrVariables = this.__variables.join('')
        break
      case 'CONSTRUCT':
        graphOrVariables = `{
          ${this.__constructGraph.join('\n')}
        }`
        break
      default:
        graphOrVariables = ''
    }

    return `
      ${buildPrefixes(this.__prefixes)}
      
      ${this.__kind} ${graphOrVariables}
      WHERE {
        ${this.__patterns.join('\n')}
      }`
  }

  public execute (client: any): Promise<any> {
    const query = this.build()

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
