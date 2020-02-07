import { DomainError, factory } from '@tpluscode/fun-ddr'
import slug from 'url-slug'
import { CsvSource } from '../source'
import { SourceEvents } from '../source/events'
import { Project } from './index'

interface UploadSourceCommand {
  fileName: string;
  type: 'csv' | 'excel';
  columns: string[];
  sample: string[][];
}

interface UploadCsvCommand extends UploadSourceCommand {
  type: 'csv';
  delimiter?: string;
  quote?: string;
}

export const createSource = factory<Project, UploadCsvCommand, CsvSource>(function (project, command, emitter) {
  if (command.columns.some(column => !column || column.trim() === '')) {
    throw new DomainError(project['@id'], 'Cannot create source', 'Columns names cannot be empty')
  }

  const sourceId = `${project['@id']}/source/${slug(command.fileName)}`

  emitter.emit<SourceEvents, 'CsvSourceUploaded'>('CsvSourceUploaded', {
    fileName: command.fileName,
    projectId: project['@id'],
    columns: command.columns,
    sampleRows: command.sample,
    delimiter: command.delimiter || ',',
    quote: command.quote || '"',
  })

  return {
    '@id': sourceId,
    '@type': [ 'Source', 'CsvSource' ],
    type: command.type,
    name: command.fileName,
    project: project['@id'],
    columns: command.columns,
    delimiter: command.delimiter || ',',
    quote: command.quote || '"',
  }
})
