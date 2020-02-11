import { factory } from '@tpluscode/fun-ddr'
import uuid from 'uuid'
import { Table } from './index'
import { ValueAttribute } from '../attribute'
import { AttributeEvents } from '../attribute/events'
import { expand } from '@zazuko/rdf-vocabularies'
import { existsInTableSource } from '../../read-graphs/table'
import { errorFactory } from '../error-helper'

export interface AddValueAttributeCommand {
  columnId?: string;
  propertyTemplate?: string;
  datatype?: string;
  language?: string;
  default?: string;
  parameters?: {
    format?: string;
    default?: string;
  };
}

export const addValueAttribute = factory<Table, AddValueAttributeCommand, ValueAttribute, AttributeEvents>(async (table, command, emitter) => {
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

  emitter.emit.ValueAttributeAdded({
    tableId: table['@id'],
    columnId: command.columnId,
    propertyTemplate: command.propertyTemplate,
    datatype: command.datatype || expand('xsd:string'),
    language: command.language,
    default: command.default,
    parameters: {
      format: command.parameters?.format,
    },
  })

  const attribute: ValueAttribute = {
    '@id': attributeId,
    '@type': ['Attribute', 'ValueAttribute'],
    tableId: table['@id'],
    column: command.columnId,
    propertyTemplate: command.propertyTemplate,
    datatype: command.datatype || expand('xsd:string'),
    language: command.language,
    default: command.default,
    parameters: {
      '@context': {
        '@vocab': 'https://rdf-cube-curation.described.at/datatype/',
      },
      format: command.parameters?.format,
    },
  }

  return attribute
})
