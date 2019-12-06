import stringToStream from 'string-to-stream'
import Parser from '@rdfjs/parser-n3'
import { prefixes } from '@zazuko/rdf-vocabularies'
import rdf from 'rdf-ext'

const parser = new Parser()

export function parseGraph (ntriples: string) {
  return async () => {
    const dataset = rdf.dataset()
    const stream = stringToStream(`
  PREFIX dataCube: <${prefixes['dataCube']}>
  PREFIX xsd: <${prefixes.xsd}>
  PREFIX rdf: <${prefixes.rdf}>
  PREFIX schema: <${prefixes.schema}>

  ${ntriples}`)
    return dataset.import(await parser.import(stream))
  }
}
