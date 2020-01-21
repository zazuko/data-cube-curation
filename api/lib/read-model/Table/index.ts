import { RdfResource } from '@tpluscode/rdfine'
import { Project } from '../'

export interface Table extends RdfResource {
  readonly columns: Column[];
  readonly attributes: Attribute[];
  readonly project: Project;
}

export interface DimensionTable extends Table {
  readonly identifierTemplate: string | undefined;
}

export interface Column extends RdfResource {
  readonly name: string;
}

export interface Attribute extends RdfResource {
  readonly propertyTemplate: string;
}

export interface ValueAttribute extends Attribute {
  readonly column: Column;
  readonly language: string;
  readonly datatype: RdfResource;
  readonly parameters: Record<string, string>;
}

export interface ColumnMapping extends RdfResource {
  readonly sourceColumn: Column;
  readonly referencedColumn: Column;
}

export interface ReferenceAttribute extends Attribute {
  readonly referencedTable: DimensionTable;
  readonly columnMappings: ColumnMapping[];
}
