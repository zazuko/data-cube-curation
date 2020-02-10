import { RdfResource, ResourceIndexer } from '@tpluscode/rdfine'
import { DatasetCore } from 'rdf-js'

export interface Column extends RdfResource {
  suppressed: boolean;
  propertyUrl: string;
  language: string;
  datatype: RdfResource;
  default: string;
  valueUrl: string;
  title: string;
}

export interface TableSchema extends RdfResource {
  columns: Column[];
  aboutUrl: string;
}

export interface Dialect {
  quote: string;
  delimiter: string;
  readonly isSet: boolean;
}

export interface Mapping<D extends DatasetCore = DatasetCore> extends RdfResource<D> {
  newColumn(col: { name: string }): Column & ResourceIndexer;
  addDialect(dialect?: { delimiter: string; quote: string }): void;
  readonly tableSchema: TableSchema;
  url: string;
  dialect: Dialect;
}
