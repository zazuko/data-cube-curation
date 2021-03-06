import { factory } from '@tpluscode/fun-ddr'
import urlSlug from 'url-slug'
import { Project } from './index'
import { TableCommand } from './createFactTable'
import { errorFactory } from '../error-helper'
import { DimensionTable, Table } from '../table'
import { TableEvents } from '../table/events'
import { hasSource } from '../../read-graphs/project'
import { extractColumns } from '../table/identifierTemplate'
import { ProjectEvents } from './events'

interface CreateDimensionTableCommand extends TableCommand {
  identifierTemplate: string;
}

export const addDimensionTable = factory<Project, CreateDimensionTableCommand, Table, ProjectEvents>(async (project, cmd, emitter) => {
  const DomainError = errorFactory(project, 'Cannot create dimension table')
  if (!cmd.tableName) {
    throw new DomainError('Name missing')
  }
  if (!cmd.identifierTemplate) {
    throw new DomainError('Identifier template missing')
  }
  if (!await hasSource(project['@id'], cmd.sourceId)) {
    throw new DomainError('Source does not belong to the project')
  }

  const columns = await extractColumns(cmd.sourceId, cmd.identifierTemplate)
  if (columns instanceof Error) {
    throw new DomainError(`Template is not correct. ${columns.message}`)
  }

  const tableId = `${project['@id']}/table/${urlSlug(cmd.tableName)}`

  const table: DimensionTable = {
    '@id': tableId,
    projectId: project['@id'],
    '@type': 'Table',
    sourceId: cmd.sourceId,
    tableName: cmd.tableName,
    identifierTemplate: cmd.identifierTemplate,
  }

  emitter.emitFrom<TableEvents>().DimensionTableCreated(table)

  return table
})
