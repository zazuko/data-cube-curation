import { mutate } from '@tpluscode/fun-ddr'
import { Project } from './index'
import { ProjectEvents } from './events'
import { sources } from '../../storage/repository'
import { errorFactory } from '../error-helper'

export interface TableCommand {
  sourceId: string;
  tableName: string;
  identifierTemplate: string | null;
}

export const selectFactTableSource = mutate<Project, TableCommand, ProjectEvents>(async (project, command, emitter) => {
  const DomainError = errorFactory(project, 'Cannot initialise fact table')

  if (project.factTableSource) {
    throw new DomainError('Fact table has already been selected.')
  }

  const source = await sources.load(command.sourceId).then(ar => ar.state)
  if (!source) {
    throw new DomainError(`Source '${command.sourceId}' was not found`)
  }
  if (source.project !== project['@id']) {
    throw new DomainError(`Source '${command.sourceId}' does not belong to project '${project['@id']}'`)
  }

  emitter.emit.FactTableSourceSelected({
    sourceId: command.sourceId,
    tableName: command.tableName,
    identifierTemplate: command.identifierTemplate,
  })

  return {
    ...project,
    factTableSource: command.sourceId,
  }
})
