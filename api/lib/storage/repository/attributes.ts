import { createRepository } from './create'
import { Attribute } from '../../domain/attribute'
import { expand } from '@zazuko/rdf-vocabularies'

const context = {
  datatype: { '@id': expand('rdf:type'), '@type': '@id' },
  table: { '@id': 'table', '@type': '@id' },
  column: { '@id': 'column', '@type': '@id' },
}
const frame = {
  '@type': 'Attribute',
}
export const attributes = createRepository<Attribute>(frame, context)
