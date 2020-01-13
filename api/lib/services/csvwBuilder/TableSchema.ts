import { namespace, property, RdfResourceImpl } from '@tpluscode/rdfine'
import { csvw } from '../../namespaces'
import * as Csvw from './index'

@namespace(csvw)
export class TableSchema extends RdfResourceImpl implements Csvw.TableSchema {
  public set columns (columns: Csvw.Column[]) {
    this._node.addList(csvw.column, columns.map(c => c._node))
  }

  @property.literal()
  public aboutUrl: string;
}
