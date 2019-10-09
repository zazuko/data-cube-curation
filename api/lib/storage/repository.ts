import { Project } from '../domain/project'
import { Source } from '../domain/source'
import { Table } from '../domain/table'
import { createRepository } from './repository/create'

export { attributes } from './repository/attributes'

const projectFrame = {
  '@type': 'Project',
}
export const projects = createRepository<Project>(projectFrame)

const sourceContext = {
  columns: 'column',
  project: { '@id': 'project', '@type': '@id' },
}
const sourceFrame = {
  '@type': 'Source',
}
export const sources = createRepository<Source>(sourceFrame, sourceContext)

const tableContext = {
  project: { '@id': 'project', '@type': '@id' },
}
const tableFrame = {
  '@type': 'Table',
}
export const tables = createRepository<Table>(tableFrame, tableContext)
