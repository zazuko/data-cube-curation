import { RdfResource } from '@tpluscode/rdfine'
export { wireUp } from './wireUp'

export * from './Table'

export interface Project extends RdfResource {
  name: string;
  baseUri: string;
  tables: RdfResource;
}

export interface Source extends RdfResource {
  readonly name: string;
}

export interface CsvSource extends Source {
  readonly quote: string;
  readonly delimiter: string;
}
