import express from 'express'
import { Term } from 'rdf-js'

class Variable {
  private readonly __term: Term

  public constructor (term?: Term) {
    this.__term = term
  }

  public get value (): any | null {
    if (this.__term) {
      return this.__term.value
    }

    return null
  }
}

export function buildVariables<T extends Record<string, string>> (req: express.DataCubeRequest, mappings: T): Record<keyof T, Variable> {
  return Object.entries(mappings).reduce((locals, mapping) => {
    const name = mapping[0] as keyof T
    const property = mapping[1]

    locals[name] = undefined

    req.graph.match(null, property).toArray().map(t => t.object).forEach((term) => {
      if (locals[name]) {
        if (!Array.isArray(locals[name])) {
          locals[name] = [locals[name]]
        }

        locals[name].push(new Variable(term))
      } else {
        locals[name] = new Variable(term)
      }
    })

    return locals
  }, {} as any)
}
