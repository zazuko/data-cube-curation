import { initialize, Entity, DomainError } from '@tpluscode/fun-ddr'
import urlSlug from 'url-slug'
import { TableEvents } from './events'
import { extractColumns } from './identifierTemplate'

export { update } from './update'

export interface Table extends Entity {
  sourceId: string;
  projectId: string;
  tableName: string;
}

export interface FactTable extends Table {
  identifierTemplate: string | null;
}

export interface DimensionTable extends Table {
  identifierTemplate: string;
}

interface CreateTableCommand {
  sourceId: string;
  projectId: string;
  tableName: string;
  identifierTemplate: string | null;
}

export const createTable = initialize<Table, CreateTableCommand, TableEvents>(async (cmd, emitter) => {
  const tableId = `${cmd.projectId}/table/${urlSlug(cmd.tableName)}`

  emitter.emit.FactTableCreated({
    projectId: cmd.projectId,
    sourceId: cmd.sourceId,
    tableName: cmd.tableName,
    identifierTemplate: cmd.identifierTemplate,
  })

  if (cmd.identifierTemplate) {
    const columns = await extractColumns(cmd.sourceId, cmd.identifierTemplate)
    if (columns instanceof Error) {
      throw new DomainError('', 'Cannot create table', `Template is not correct. ${columns.message}`)
    }
  }

  return {
    '@id': tableId,
    '@type': 'Table',
    projectId: cmd.projectId,
    sourceId: cmd.sourceId,
    tableName: cmd.tableName,
    identifierTemplate: cmd.identifierTemplate,
  }
})
