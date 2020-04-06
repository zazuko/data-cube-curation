import { namespace, property } from '@tpluscode/rdfine'
import RdfResource from '@tpluscode/rdfine/RdfResource'
import { NamedNode } from 'rdf-js'
import ns from '@rdfjs/namespace'
import { rdf } from '@tpluscode/rdf-ns-builders'

const nsPipeline = ns('https://pipeline.described.at/')

let variableIdCounter = 0

function nextVariableId () {
  return `v${++variableIdCounter}`
}

@namespace(nsPipeline)
class Variable extends RdfResource {
  @property.literal()
  public name!: string

  @property.literal()
  public value!: string

  @property({
    path: rdf.type,
    initial: nsPipeline.Variable,
  })
  protected __rdfType!: NamedNode
}

@namespace(nsPipeline)
class Variables extends RdfResource {
  @property.resource({
    path: 'variable',
    values: 'array',
  })
  public variables: Variable[]
}

@namespace(nsPipeline)
export class Pipeline extends RdfResource {
  public addVariable (name: string, value: string) {
    const variable = this.__variableSets[0].variables.find(v => v.name === name)

    if (variable) {
      variable.value = value
    } else {
      const newVariable = this._create<Variable>(this._selfGraph.blankNode(nextVariableId()), [Variable])
      newVariable.name = name
      newVariable.value = value

      this.__variableSets[0].variables = [
        ...this.__variableSets[0].variables,
        newVariable,
      ]
    }
  }

  @property.resource({
    path: 'variables',
    values: 'array',
    as: [Variables],
    initial: self => {
      return self._selfGraph.blankNode(nextVariableId()).term
    },
  })
  private __variableSets!: Variables[]
}
