import { Entity } from '@tpluscode/fun-ddr'

export { selectFactTableSource } from './createFactTable'
export { addDimensionTable } from './createDimensionTable'

export interface Project extends Entity {
  name: string;
  archived: 'true' | 'false';
  factTableSource?: string;
}

export { createProject } from './createProject'
export { renameProject } from './renameProject'
export { createSource } from './createSource'
export { archiveProject } from './archiveProject'
