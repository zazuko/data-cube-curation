import { TypedClownfaceEntity } from '../../read-model/TypedClownfaceEntity'

export interface Column {
  suppressed: boolean;
  propertyUrl: string;
  language: string;
  datatype: TypedClownfaceEntity;
  valueUrl: string;
}

export interface TableSchema {
  columns: Column[];
  aboutUrl: string;
}

export interface Mapping {
  newColumn(col: { name: string }): Column;
  addDialect(): void;
  readonly tableSchema: TableSchema;
}
