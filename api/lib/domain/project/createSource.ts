import { DomainError, factory } from '@tpluscode/fun-ddr'
import slug from 'url-slug'
import { CsvSource, csvDefault } from '../source'
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

function valueOrDefault (value: string | null | undefined, defaultValue: string) {
  if (typeof value !== 'string') {
    return defaultValue
  }

  return value
}

export const createSource = factory<Project, UploadCsvCommand, CsvSource>(function (project, command, emitter) {
  if (command.columns.some(column => !column || column.trim() === '')) {
    throw new DomainError(project['@id'], 'Cannot create source', 'Columns names cannot be empty')
  }

  const sourceId = `${project['@id']}/source/${slug(command.fileName)}`

  const delimiter = valueOrDefault(command.delimiter, csvDefault.delimiter)
  const quote = valueOrDefault(command.quote, csvDefault.quote)

  emitter.emit<SourceEvents, 'CsvSourceUploaded'>('CsvSourceUploaded', {
    fileName: command.fileName,
    projectId: project['@id'],
    columns: command.columns,
    sampleRows: command.sample,
    delimiter,
    quote,
  })

  return {
    '@id': sourceId,
    '@type': [ 'Source', 'CsvSource' ],
    type: command.type,
    name: command.fileName,
    project: project['@id'],
    columns: command.columns,
    delimiter,
    quote,
  }
})
