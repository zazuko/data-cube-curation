import { TypedClownfaceEntity } from '../TypedClownfaceEntity'

export interface Table extends TypedClownfaceEntity {
  readonly columns: Column[];
  readonly attributes: Attribute[];
}

export interface DimensionTable extends Table {
  readonly identifierTemplate: string;
}

export interface Column {
  readonly name: string;
}

export interface Attribute extends TypedClownfaceEntity {
  readonly predicate: string;
}

export interface ValueAttribute extends Attribute {
  readonly language: string;
  readonly datatype: TypedClownfaceEntity;
}

export interface ColumnMapping {
  readonly sourceColumn: Column;
  readonly referencedColumn: Column;
}

export interface ReferenceAttribute extends Attribute {
  readonly referencedTable: DimensionTable;
  readonly columnMappings: ColumnMapping[];
}
