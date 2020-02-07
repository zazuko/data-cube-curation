import { Entity } from '@tpluscode/fun-ddr'

export interface Source extends Entity {
  type: 'csv' | 'excel';
  project: string;
  columns: string[];
  name: string;
}

export interface CsvSource extends Source {
  type: 'csv';
  delimiter: string;
  quote: string;
}
