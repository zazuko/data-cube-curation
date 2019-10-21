import SparqlHttp from 'sparql-http-client'
import { Builder } from './Builder'

export class DescribeBuilder extends Builder<any> {
  private __patterns: string[] = []
  private __variables: string[]

  public constructor (idOrVariable: string, additionalVariables: string[]) {
    super()
    this.__variables = [idOrVariable, ...additionalVariables]
  }

  public _executeInternal (client: SparqlHttp, query: string) {
    return client.constructQuery(query)
      .then(this._checkResponse)
      .then(response => response.quadStream())
  }

  public where (...patterns: string[]) {
    this.__patterns = [ ...this.__patterns, ...patterns ]

    return this
  }

  protected _buildQueryInternal () {
    const variables = this.__variables.map(variable => variable.startsWith('?') ? variable : `<${variable}>`)

    return `DESCRIBE ${variables.join(' ')} {
      ${this.__patterns.join('\n')}
    }`
  }
}
