import { namespace, property, RdfResourceImpl } from '@tpluscode/rdfine'
import { csvw } from '../../namespaces'
import * as Csvw from './index'
import { ColumnMixin } from './Column'

@namespace(csvw)
export class TableSchema extends RdfResourceImpl implements Csvw.TableSchema {
  @property.resource({
    path: csvw.column,
    values: 'list',
    as: [ColumnMixin],
  })
  public columns!: Csvw.Column[]

  @property.literal()
  public aboutUrl: string;
}
