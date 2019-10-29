import { factory } from '@tpluscode/fun-ddr'
import { Table } from './index'
import { Attribute } from '../attribute'
import { AttributeEvents } from '../attribute/events'
import { expand } from '@zazuko/rdf-vocabularies'
import { existsInTableSource } from '../../read-graphs/table'
import { errorFactory } from '../error-helper'

interface AddAttributeCommand {
  name: string;
  columnId: string;
  predicate: string;
  datatype?: string;
  language?: string;
}

export const addAttribute = factory<Table, AddAttributeCommand, Attribute>(async (table, command, emitter) => {
  const DomainError = errorFactory(table, 'Cannot add attribute to table')

  if (!command.name) {
    throw new DomainError('Name missing')
  }
  if (!command.predicate) {
    throw new DomainError('Predicate missing')
  }
  if (!command.columnId) {
    throw new DomainError('Column missing')
  }
  if (command.datatype && command.language) {
    throw new DomainError('Datatype and language cannot be used together')
  }
  if (!await existsInTableSource(table['@id'], command.columnId)) {
    throw new DomainError("Column not found or it does not belong to the table's source")
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
