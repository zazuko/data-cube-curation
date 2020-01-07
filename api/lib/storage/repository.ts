import { Project } from '../domain/project'
import { Source } from '../domain/source'
import { Table } from '../domain/table'
import { createRepository } from './repository/create'
import once from 'once'

export { attributes } from './repository/attributes'

const projectFrame = {
  '@type': 'Project',
}
export const projects = once(() => createRepository<Project>(projectFrame))

const sourceContext = {
  columns: {
    '@id': 'column',
    '@container': '@list',
  },
  project: { '@id': 'project', '@type': '@id' },
}
const sourceFrame = {
  '@type': 'Source',
}
export const sources = once(() => createRepository<Source>(sourceFrame, sourceContext))

const tableContext = {
  project: { '@id': 'project', '@type': '@id' },
}
const tableFrame = {
  '@type': 'Table',
}
export const tables = once(() => createRepository<Table>(tableFrame, tableContext))
