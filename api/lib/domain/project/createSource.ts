import { DomainError, factory } from '@tpluscode/fun-ddr'
import slug from 'url-slug'
import { Source } from '../source'
import { SourceEvents } from '../source/events'
import { Project } from './index'

interface UploadSourceCommand {
  fileName: string;
  type: 'csv' | 'excel';
  columns: string[];
  sample: string[][];
}

export const createSource = factory<Project, UploadSourceCommand, Source>(function (project, command, emitter) {
  if (command.columns.findIndex(column => !column || column.trim() === '') > 0) {
    throw new DomainError(project['@id'], 'Cannot create source', 'Columns names cannot be empty')
  }

  const sourceId = `${project['@id']}/source/${slug(command.fileName)}`

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
  }
})
