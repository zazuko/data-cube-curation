import { createRepository } from './create'
import { Attribute } from '../../domain/attribute'
import { expand } from '@zazuko/rdf-vocabularies'
import once from 'once'

const context = {
  predicate: { '@id': expand('rdf:predicate'), '@type': '@id' },
  datatype: { '@id': expand('rdf:type'), '@type': '@id' },
  table: { '@id': 'table', '@type': '@id' },
  column: { '@id': 'column', '@type': '@id' },
}
const frame = {
  '@type': 'Attribute',
}
export const attributes = once(() => createRepository<Attribute>(frame, context))
