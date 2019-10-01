import { mutate } from 'fun-ddr'
import { Project } from './index'
import { ProjectEvents } from './events'
import { sources } from '../../storage/repository'

interface CreateFactTableCommand {
  sourceId: string;
  tableName: string;
}

export const selectFactTableSource = mutate<Project, CreateFactTableCommand>(async (project, command, emitter) => {
  if (project.factTableSource) {
    throw new Error('Fact table has already been selected.')
  }

  const source = await sources.load(command.sourceId)
  if (!source.state) {
    throw new Error(`Source '${command.sourceId}' was not found`)
  }
  if (source.state.project !== project['@id']) {
    throw new Error(`Source '${command.sourceId}' does not belong to project '${project['@id']}'`)
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
