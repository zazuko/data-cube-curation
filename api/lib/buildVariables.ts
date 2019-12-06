import express from 'express'
import { Term } from 'rdf-js'

interface ReadOnlyVariable {
  value: any | null;
  values: any[];
  terms: Term[];
}

class Variable {
  private readonly __terms: Term[] = []

  public constructor (term?: Term) {
    if (term) {
      this.__terms = [ term ]
    }
  }

  public get value (): any | null {
    if (this.__terms.length === 1) {
      return this.__terms[0].value
    }

    return null
  }

  public get values (): any[] {
    return this.__terms.map(term => term.value)
  }

  public get terms (): any[] {
    return this.__terms
  }

  public push (term: Term) {
    this.__terms.push(term)
  }
}

export function buildVariables<T extends Record<string, string>> (req: express.Request, mappings: T): Record<keyof T, ReadOnlyVariable> {
  return Object.entries(mappings).reduce((locals, mapping) => {
    const name = mapping[0] as keyof T
    const property = mapping[1]

    locals[name] = new Variable()

    req.graph.match(null, property).toArray().map(t => t.object).forEach((term) => {
      if (locals[name]) {
        locals[name].push(term)
      } else {
        locals[name] = new Variable(term)
      }
    })

    return locals
  }, {} as any as Record<keyof T, Variable>)
}
