import { Entity } from '@tpluscode/fun-ddr'

export interface Attribute extends Entity {
  tableId: string;
  propertyTemplate: string;
}

export interface ValueAttribute extends Attribute {
  column: string;
  datatype: string;
  language?: string;
  default?: string;
  parameters: {
    '@context': {
      '@vocab': 'https://rdf-cube-curation.described.at/datatype/';
    };
    format?: string;
  };
}

export interface ReferenceAttribute extends Attribute {
  referencedTableId: string;
  columnMappings: {
    sourceColumnId: string;
    referencedColumnId: string;
  }[];
}
