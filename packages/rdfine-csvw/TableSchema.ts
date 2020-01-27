import { Constructor, namespace, property } from '@tpluscode/rdfine'
import { csvw } from './namespaces'
import * as Csvw from './index'
import { ColumnMixin } from './Column'

export function TableSchemaMixin<Base extends Constructor> (base: Base) {
  @namespace(csvw)
  class TableSchema extends base implements Csvw.TableSchema {
    @property.resource({
      path: csvw.column,
      values: 'list',
      as: [ColumnMixin],
    })
    public columns!: Csvw.Column[]

    @property.literal()
    public aboutUrl: string;
  }

  return TableSchema
}
