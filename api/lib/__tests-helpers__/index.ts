import stringToStream from 'string-to-stream'
import Parser from '@rdfjs/parser-n3'
import rdf from 'rdf-ext'
import { DomainEventEmitter } from '@tpluscode/fun-ddr/lib'
import { TurtleTemplateResult } from '@tpluscode/rdf-string'

const parser = new Parser()

export function parseGraph (ntriples: TurtleTemplateResult, base?: string) {
  return async () => {
    const dataset = rdf.dataset()
    const stream = stringToStream(ntriples.toString({ base }))
    return dataset.import(await parser.import(stream))
  }
}

export function fakeDomainEventEmitter (fn = jest.fn()): DomainEventEmitter<any> {
  return {
    emit: new Proxy({}, { get: () => fn }) as any,
    emitFrom: fn,
  }
}
