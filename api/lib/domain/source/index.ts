import { Entity } from '@tpluscode/fun-ddr'

export interface Source extends Entity {
  type: 'csv' | 'excel';
  project: string;
  columns: string[];
}
