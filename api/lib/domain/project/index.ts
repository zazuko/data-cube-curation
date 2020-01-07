import { Entity } from '@tpluscode/fun-ddr'
import urlSlug from 'url-slug'

export { selectFactTableSource } from './createFactTable'
export { unselectFactTable } from './unselectFactTable'
export { addDimensionTable } from './createDimensionTable'

export interface Project extends Entity {
  name: string;
  archived: 'true' | 'false';
  factTableSource?: string;
  baseUri: string;
}

export { createProject } from './createProject'
export { updateProject } from './updateProject'
export { createSource } from './createSource'
export { archiveProject } from './archiveProject'

export const temporaryUri = (name: string) => `http://cube.data/${urlSlug(name)}/`
