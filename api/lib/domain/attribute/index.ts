import { Entity } from '@tpluscode/fun-ddr'

export interface Attribute extends Entity {
  tableId: string;
  predicate: string;
}

export interface ValueAttribute extends Attribute {
  column: string;
  datatype: string;
  language?: string;
}
