import { factory } from '@tpluscode/fun-ddr'
import { Project } from './index'
import { TableCommand } from './createFactTable'
import { errorFactory } from '../error-helper'
import { DimensionTable, Table } from '../table'
import { TableEvents } from '../table/events'
import { hasSource } from '../../read-graphs/project'
import { templateIsValid } from '../table/identifierTemplate'

interface CreateDimensionTableCommand extends TableCommand {
  identifierTemplate: string;
}

export const addDimensionTable = factory<Project, CreateDimensionTableCommand, Table>(async (project, cmd, emitter) => {
  const DomainError = errorFactory(project, 'Cannot create dimension table')
  if (!cmd.tableName) {
    throw new DomainError('Name missing')
  }
  if (!cmd.identifierTemplate) {
    throw new DomainError('Identifier template missing')
  }
  if (!hasSource(project['@id'], cmd.sourceId)) {
    throw new DomainError('Source does not belong to the project')
  }
  if (await templateIsValid(cmd.sourceId, cmd.identifierTemplate) === false) {
    throw new DomainError('Template is not correct. It must be a well-formed URL template and all variables must match source columns')
  }

  const tableId = `${project['@id']}/table/${encodeURIComponent(cmd.tableName)}`

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
