import { factory } from '@tpluscode/fun-ddr'
import uuid from 'uuid'
import { Table } from './index'
import { ValueAttribute } from '../attribute'
import { AttributeEvents } from '../attribute/events'
import { expand } from '@zazuko/rdf-vocabularies'
import { existsInTableSource } from '../../read-graphs/table'
import { errorFactory } from '../error-helper'

interface AddValueAttributeCommand {
  columnId?: string;
  propertyTemplate?: string;
  datatype?: string;
  language?: string;
}

export const addValueAttribute = factory<Table, AddValueAttributeCommand, ValueAttribute>(async (table, command, emitter) => {
  const DomainError = errorFactory(table, 'Cannot add attribute to table')

  if (!command.propertyTemplate) {
    throw new DomainError('Property template missing')
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

  const attributeId = `${table['@id']}/attribute/${uuid()}`

  emitter.emit<AttributeEvents, 'ValueAttributeAdded'>('ValueAttributeAdded', {
    tableId: table['@id'],
    columnId: command.columnId,
    propertyTemplate: command.propertyTemplate,
    datatype: command.datatype || expand('xsd:string'),
    language: command.language,
  })

  return {
    '@id': attributeId,
    '@type': ['Attribute', 'ValueAttribute'],
    tableId: table['@id'],
    column: command.columnId,
    propertyTemplate: command.propertyTemplate,
    datatype: command.datatype || expand('xsd:string'),
    language: command.language,
  }
})
