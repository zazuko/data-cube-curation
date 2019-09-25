import uuid from 'uuid'
import { mutate, bootstrap, factory, Entity } from '../../ddd'

export interface Project extends Entity {
  name: string;
}

interface Column extends Entity {
  name: string;
}

export interface Source extends Entity {
  type: 'csv' | 'excel';
  project: string;
  columns: Column[];
}

export const createProject = bootstrap<Project, string>(function (name) {
  this.emit({
    name: 'ProjectCreated',
    data: {
      name,
    },
  })

  return {
    '@id': `/project/${uuid()}`,
    '@type': 'Project',
    name: name,
  }
})

interface RenameCommand {
  newName: string;
}

export const renameProject = mutate<Project, RenameCommand>(function (state, renameCommand) {
  this.emit({
    name: 'ProjectRenamed',
    data: {
      name: renameCommand.newName,
    },
  })

  return {
    ...state,
    name: renameCommand.newName,
  }
})

interface UploadSourceCommand {
  fileName: string;
  type: 'csv' | 'excel';
  columns: string[];
}

export const createSource = factory<Project, UploadSourceCommand, Source>(function (project, command) {
  const sourceId = `${project['@id']}/source/${command.fileName}`

  return {
    '@id': sourceId,
    '@type': [ 'Source', 'CsvSource' ],
    type: command.type,
    name: command.fileName,
    project: project['@id'],
    columns: command.columns.map(name => ({
      '@id': `${sourceId}/${name}`,
      '@type': 'Column',
      name,
    })),
  }
})
