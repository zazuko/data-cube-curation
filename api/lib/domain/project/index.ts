import uuid from 'uuid'
import { mutate, initialize, factory } from 'fun-ddr'
import { Entity } from 'fun-ddr/lib'
import { ProjectEvents } from './events'
import { Source } from '../source'
import { SourceEvents } from '../source/events'

export interface Project extends Entity {
  name: string;
  archived: 'true' | 'false';
}

interface CreateCommand {
  uriSlug?: string;
  name: string;
}

export const createProject = initialize<Project, CreateCommand>(function (createCommand, emitter) {
  emitter.emit<ProjectEvents, 'ProjectCreated'>('ProjectCreated', {
    name: createCommand.name,
  })

  return {
    '@id': `/project/${createCommand.uriSlug || uuid()}`,
    '@type': 'Project',
    name: createCommand.name,
    archived: 'false',
  }
})

interface RenameCommand {
  newName: string;
}

export const renameProject = mutate<Project, RenameCommand>(function (state, renameCommand, emitter) {
  if (state.name !== renameCommand.newName) {
    emitter.emit<ProjectEvents, 'ProjectRenamed'>('ProjectRenamed', {
      name: renameCommand.newName,
    })
  }

  return {
    ...state,
    name: renameCommand.newName,
  }
})

interface UploadSourceCommand {
  fileName: string;
  type: 'csv' | 'excel';
  columns: string[];
  sample: string[][];
}

export const createSource = factory<Project, UploadSourceCommand, Source>(function (project, command, emitter) {
  const sourceId = `${project['@id']}/source/${command.fileName}`

  emitter.emit<SourceEvents, 'SourceUploaded'>('SourceUploaded', {
    fileName: command.fileName,
    projectId: project['@id'],
    columns: command.columns,
    sampleRows: command.sample,
  })

  return {
    '@id': sourceId,
    '@type': [ 'Source', 'CsvSource' ],
    type: command.type,
    name: command.fileName,
    project: project['@id'],
    columns: command.columns,
    archived: 'false',
  }
})

export const archiveProject = mutate<Project, never>(function (state, cmd, emitter) {
  if (state.archived === 'false') {
    emitter.emit<ProjectEvents, 'ProjectArchived'>('ProjectArchived', {})
  }

  return {
    ...state,
    archived: 'true',
  }
})
