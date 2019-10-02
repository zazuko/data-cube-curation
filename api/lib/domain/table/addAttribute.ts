import { factory } from '@tpluscode/fun-ddr'
import { Table } from './index'
import { Attribute } from '../attribute'
import { AttributeEvents } from '../attribute/events'
import { expand } from '@zazuko/rdf-vocabularies'

interface AddAttributeCommand {
  name: string;
  columnId: string;
  predicate: string;
  datatype?: string;
  language?: string;
}

export const addAttribute = factory<Table, AddAttributeCommand, Attribute>(async (table, command, emitter) => {
  if (!command.name) {
    throw new Error('Name missing')
  }
  if (!command.predicate) {
    throw new Error('Predicate missing')
  }
  if (!command.columnId) {
    throw new Error('Column missing')
  }
  if (command.datatype && command.language) {
    throw new Error('Datatype and language cannot be used together')
  }

  const attributeId = `${table['@id']}/attribute/${encodeURIComponent(command.name)}`

  emitter.emit<AttributeEvents, 'AttributeAdded'>('AttributeAdded', {
    name: command.name,
    tableId: table['@id'],
    columnId: command.columnId,
    predicate: command.predicate,
    datatype: command.datatype,
    language: command.language,
  })

  return {
    '@id': attributeId,
    '@type': 'Attribute',
    tableId: table['@id'],
    name: command.name,
    column: command.columnId,
    predicate: command.predicate,
    datatype: command.datatype || expand('xsd:string'),
    language: command.language,
  }
})
