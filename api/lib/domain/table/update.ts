import { mutate } from '@tpluscode/fun-ddr'
import { DimensionTable, FactTable } from './index'
import { TableEvents } from './events'
import { errorFactory } from '../error-helper'

interface UpdateTableCommand {
  name: string;
  identifierTemplate?: string;
}

export const update = mutate<DimensionTable | FactTable, UpdateTableCommand, TableEvents>((table, updated, emitter) => {
  const DomainError = errorFactory(table, 'Cannot update table')

  const changedTable = { ...table }
  if (table['@type'].includes('DimensionTable') && !updated.identifierTemplate) {
    throw new DomainError('Identifier template cannot be empty')
  }
  if (!updated.name) {
    throw new DomainError('Name cannot be empty')
  }

  if (table.identifierTemplate !== updated.identifierTemplate) {
    const identifierTemplate = updated.identifierTemplate || null
    changedTable.identifierTemplate = identifierTemplate
    emitter.emit.TableIdentifierTemplateChanged({
      identifierTemplate,
    })
  }

  if (table.tableName !== updated.name) {
    changedTable.tableName = updated.name
    emitter.emit.TableNameChanged({
      name: updated.name,
    })
  }

  return changedTable
})
