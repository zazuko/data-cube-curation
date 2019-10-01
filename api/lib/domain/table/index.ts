import { initialize } from 'fun-ddr'
import { Entity } from 'fun-ddr/lib'
import { TableEvents } from './events'

export interface Table extends Entity {
  sourceId: string;
  projectId: string;
}

interface CreateTableCommand {
  sourceId: string;
  projectId: string;
  tableName: string;
}

export const createTable = initialize<Table, CreateTableCommand>((cmd, emitter) => {
  const tableId = `${cmd.projectId}/table/${cmd.tableName}`

  emitter.emit<TableEvents, 'FactTableCreated'>('FactTableCreated', {
    projectId: cmd.projectId,
    sourceId: cmd.sourceId,
  })

  return {
    '@id': tableId,
    '@type': 'Table',
    projectId: cmd.projectId,
    sourceId: cmd.sourceId,
  }
})
