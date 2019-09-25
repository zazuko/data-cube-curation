import uuid from 'uuid'
import { mutate, bootstrap, factory, State } from '../../ddd'

export interface Project extends State {
  name: string;
}

export interface Source extends State {
  type: 'csv' | 'excel';
  columns: string[];
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
  return {
    '@id': `${project['@id']}/${command.fileName}`,
    '@type': [ 'Source', 'CsvSource' ],
    type: command.type,
    columns: command.columns,
  }
})
