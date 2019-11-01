import { mutate } from '@tpluscode/fun-ddr'
import { Project } from './index'
import { ProjectEvents } from './events'
import { sources } from '../../storage/repository'
import { errorFactory } from '../error-helper'

interface CreateFactTableCommand {
  sourceId: string
  tableName: string
}

export const selectFactTableSource = mutate<Project, CreateFactTableCommand>(async (project, command, emitter) => {
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

  emitter.emit<ProjectEvents, 'FactTableSourceSelected'>('FactTableSourceSelected', {
    sourceId: command.sourceId,
    tableName: command.tableName,
  })

  return {
    ...project,
    factTableSource: command.sourceId,
  }
})
