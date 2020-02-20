import { Entity } from '@tpluscode/fun-ddr'

export { selectFactTableSource } from './createFactTable'
export { unselectFactTable } from './unselectFactTable'
export { addDimensionTable } from './createDimensionTable'

export interface Project extends Entity {
  name: string;
  archived: 'true' | 'false';
  factTableSource?: string | null;
  baseUri: string;
  s3Bucket: string;
  graphUri?: string;
}

export { createProject } from './createProject'
export { updateProject } from './updateProject'
export { createSource } from './createSource'
export { archiveProject } from './archiveProject'
