import { RdfResource } from '@tpluscode/rdfine'

export interface Column extends RdfResource {
  suppressed: boolean;
  propertyUrl: string;
  language: string;
  datatype: RdfResource;
  valueUrl: string;
  title: string;
}

export interface TableSchema extends RdfResource {
  columns: Column[];
  aboutUrl: string;
}

export interface Mapping extends RdfResource {
  newColumn(col: { name: string }): Column;
  addDialect(): void;
  readonly tableSchema: TableSchema;
}
