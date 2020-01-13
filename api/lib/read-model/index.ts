import { RdfResource } from '@tpluscode/rdfine'

export interface Project extends RdfResource {
  name: string;
  baseUri: string;
}
