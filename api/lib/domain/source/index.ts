import { Entity } from 'fun-ddr/lib'

export interface Source extends Entity {
  type: 'csv' | 'excel';
  project: string;
  columns: string[];
}
