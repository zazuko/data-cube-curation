import { mutate } from '@tpluscode/fun-ddr'
import { Project } from './index'
import { ProjectEvents } from './events'
import { sources } from '../../storage/repository'
import { errorFactory } from '../error-helper'

interface CreateFactTableCommand {
  sourceId: string;
  tableName: string;
}

export const selectFactTableSource = mutate<Project, CreateFactTableCommand>(async (project, command, emitter) => {
  const error = errorFactory(project, 'Cannot initialise fact table')

  if (project.factTableSource) {
    throw error('Fact table has already been selected.')
  }

  const source = await sources.load(command.sourceId).then(ar => ar.state)
  if (!source) {
    throw error(`Source '${command.sourceId}' was not found`)
  }
  if (source.project !== project['@id']) {
    throw error(`Source '${command.sourceId}' does not belong to project '${project['@id']}'`)
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
