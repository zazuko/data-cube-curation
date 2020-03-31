import { RdfResource } from '@tpluscode/rdfine'
import * as Csvw from '@rdfine/csvw'
import { Project, Source } from '../'

export interface Table extends RdfResource {
  readonly columns: Column[];
  readonly attributes: Attribute[];
  readonly project: Project;
  readonly source: Source;
  readonly csvw: Csvw.Mapping;
  readonly name: string;
  readonly identifierTemplate: string | undefined;
  createIdentifier (): string | null;
}

export interface FactTable extends Table {
  missingIdentifierColumns: string[];
}

export interface Column extends RdfResource {
  readonly name: string;
  readonly order: number;
}

export interface Attribute extends RdfResource {
  readonly propertyTemplate: string;
}

export interface ValueAttribute extends Attribute {
  readonly column: Column;
  readonly default: string;
  readonly language: string;
  readonly datatype: RdfResource;
  readonly parameters: Record<string, string>;
}

export interface ColumnMapping extends RdfResource {
  readonly sourceColumn: Column;
  readonly referencedColumn: Column;
}

export interface ReferenceAttribute extends Attribute {
  readonly referencedTable: Table;
  readonly columnMappings: ColumnMapping[];
}
