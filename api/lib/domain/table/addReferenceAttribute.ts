import uuid from 'uuid'
import cf from 'clownface'
import { DatasetCore, NamedNode } from 'rdf-js'
import { factory } from '@tpluscode/fun-ddr'
import { rdf } from '@tpluscode/rdf-ns-builders'
import { Table } from './index'
import { ReferenceAttribute } from '../attribute'
import { errorFactory } from '../error-helper'
import { AttributeEvents } from '../attribute/events'
import { getSourceColumns } from '../../read-graphs/source/getSourceColumns'
import { getTableSourceId } from '../../read-graphs/table'
import { dataCube } from '../../namespaces'
import { extractColumns } from './identifierTemplate'
import { getIdentifierTemplate } from '../../read-graphs/table/dimensionTable'

interface ColumnMapping {
  sourceColumnId: string;
  referencedColumnId: string;
}

interface AddReferenceAttributeCommand {
  propertyTemplate?: string;
  referencedTableId?: string;
  columnMappings: ColumnMapping[];
}

function validateColumns (columnsDataset: any, columnMappings: ColumnMapping[]) {
  return async function (selectColumn: (m: ColumnMapping) => string) {
    const errors: string[] = []
    const columns = cf({ dataset: columnsDataset })
      .has(rdf.type, dataCube.Column)
      .terms
      .map((term: NamedNode) => term.value)

    columnMappings.forEach(mapping => {
      const columnId = selectColumn(mapping)

      if (!columns.includes(columnId)) {
        errors.push(`Column ${columnId} not found`)
      }
    })

    return errors
  }
}

async function validateSourceColumns (columnsDataset: DatasetCore, columnMappings: ColumnMapping[]) {
  return validateColumns(columnsDataset, columnMappings)(mapping => mapping.sourceColumnId)
}

async function validateReferencedColumns (tableId: string, columnsDataset: DatasetCore, columnMappings: ColumnMapping[]) {
  const errors = await validateColumns(columnsDataset, columnMappings)(mapping => mapping.referencedColumnId)

  const template = await getIdentifierTemplate(tableId)
  const identifierColumns = await extractColumns(columnsDataset, template)
  if (identifierColumns instanceof Error) throw identifierColumns

  identifierColumns.forEach(column => {
    if (!columnMappings.find(mapping => mapping.referencedColumnId === column.id)) {
      errors.push(`Column ${column} is part of referenced table's identifier but not used in the attribute`)
    }
  })

  return errors
}

export const addReferenceAttribute = factory<Table, AddReferenceAttributeCommand, ReferenceAttribute, AttributeEvents>(async (table, command, emitter) => {
  const DomainError = errorFactory(table, 'Cannot add attribute to table')
  if (!command.propertyTemplate) {
    throw new DomainError('Predicate missing')
  }

  if (!command.referencedTableId) {
    throw new DomainError('Referenced table missing')
  }

  const referencedSourceId = await getTableSourceId(command.referencedTableId)
  if (!referencedSourceId) {
    throw new DomainError('Referenced table not found')
  }

  const sourceTableColumns = await getSourceColumns(table.sourceId)
  const referencedTableColumns = await getSourceColumns(referencedSourceId)

  const attributeId = `${table['@id']}/attribute/${uuid()}`
  const sourceColumnErrors = await validateSourceColumns(sourceTableColumns, command.columnMappings)
  const referencedColumnsErrors = await validateReferencedColumns(command.referencedTableId, referencedTableColumns, command.columnMappings)
  if (sourceColumnErrors.length > 0 || referencedColumnsErrors.length > 0) {
    throw new DomainError(...sourceColumnErrors, ...referencedColumnsErrors)
  }

  emitter.emit.ReferenceAttributeAdded({
    tableId: table['@id'],
    propertyTemplate: command.propertyTemplate,
    referencedTableId: command.referencedTableId,
    columnMappings: command.columnMappings,
  })

  return {
    '@id': attributeId,
    '@type': ['Attribute', 'ReferenceAttribute'],
    tableId: table['@id'],
    propertyTemplate: command.propertyTemplate,
    referencedTableId: command.referencedTableId,
    columnMappings: command.columnMappings.map(m => ({
      referencedColumnId: m.referencedColumnId,
      sourceColumnId: m.sourceColumnId,
    })),
  }
})
