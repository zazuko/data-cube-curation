import { Entity } from '../../ddd'

export interface Source extends Entity {
  type: 'csv' | 'excel';
  project: string;
  columns: string[];
}
