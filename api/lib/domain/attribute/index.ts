import { Entity } from '@tpluscode/fun-ddr'

export interface Attribute extends Entity {
  tableId: string;
  name: string;
  column: string;
  datatype: string;
  language?: string;
  predicate: string;
}
