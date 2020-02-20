import { RdfResource } from '@tpluscode/rdfine'
export { wireUp } from './wireUp'

export * from './Table'

export interface Project extends RdfResource {
  name: string;
  baseUri: string;
  tables: RdfResource;
  s3Bucket?: string;
  graphUri?: string;
}

export interface Source extends RdfResource {
  readonly name: string;
}

export interface CsvSource extends Source {
  readonly quote: string;
  readonly delimiter: string;
}
