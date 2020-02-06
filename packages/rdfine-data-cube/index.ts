import { RdfResource } from '@tpluscode/rdfine'
export { wireUp } from './wireUp'

export interface Project extends RdfResource {
  name: string;
  baseUri: string;
  tables: RdfResource;
}

export interface Source extends RdfResource {
  readonly name: string;
}
