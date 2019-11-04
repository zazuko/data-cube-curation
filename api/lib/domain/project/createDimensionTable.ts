import { factory } from '@tpluscode/fun-ddr'
import { Project } from './index'
import { TableCommand } from './createFactTable'
import { errorFactory } from '../error-helper'
import { DimensionTable, Table } from '../table'
import { TableEvents } from '../table/events'

interface CreateDimensionTableCommand extends TableCommand {
  identifierTemplate: string;
}

export const addDimensionTable = factory<Project, CreateDimensionTableCommand, Table>((project, cmd, emitter) => {
  const DomainError = errorFactory(project, 'Cannot create dimension table')
  if (!cmd.tableName) {
    throw new DomainError('Name missing')
  }

  const tableId = `${project['@id']}/table/${cmd.tableName}`

  const table: DimensionTable = {
    '@id': tableId,
    projectId: project['@id'],
    '@type': 'Table',
    sourceId: cmd.sourceId,
    identifierTemplate: cmd.identifierTemplate,
  }

  emitter.emit<TableEvents, 'DimensionTableCreated'>('DimensionTableCreated', table)

  return table
})
