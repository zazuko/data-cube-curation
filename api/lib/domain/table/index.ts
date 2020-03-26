import { initialize, Entity } from '@tpluscode/fun-ddr'
import urlSlug from 'url-slug'
import { TableEvents } from './events'

export interface Table extends Entity {
  sourceId: string;
  projectId: string;
  tableName: string;
}

export interface DimensionTable extends Table {
  identifierTemplate: string;
}

interface CreateTableCommand {
  sourceId: string;
  projectId: string;
  tableName: string;
}

export const createTable = initialize<Table, CreateTableCommand, TableEvents>((cmd, emitter) => {
  const tableId = `${cmd.projectId}/table/${urlSlug(cmd.tableName)}`

  emitter.emit.FactTableCreated({
    projectId: cmd.projectId,
    sourceId: cmd.sourceId,
    tableName: cmd.tableName,
  })

  return {
    '@id': tableId,
    '@type': 'Table',
    projectId: cmd.projectId,
    sourceId: cmd.sourceId,
    tableName: cmd.tableName,
  }
})
