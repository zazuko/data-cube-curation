import { namespace, property, RdfResourceImpl } from '@tpluscode/rdfine'
import { SingleContextClownface } from 'clownface'
import { csvw } from '../../namespaces'
import * as Csvw from './index'
import { ColumnMixin } from './Column'

@namespace(csvw)
export class TableSchema extends RdfResourceImpl implements Csvw.TableSchema {
  public set columns (columns: Csvw.Column[]) {
    this._node.addList(csvw.column, columns.map(c => c._node))
  }

  public get columns (): Csvw.Column[] {
    const columns: Csvw.Column[] = []
    const nodes = this._node.out(csvw.column).list() as any as Iterable<SingleContextClownface>
    for (const column of nodes) {
      if (column.term.termType === 'NamedNode' || column.term.termType === 'BlankNode') {
        columns.push(this._create<Csvw.Column>(column as any, [ColumnMixin]))
      }
    }

    return columns
  }

  @property.literal()
  public aboutUrl: string;
}
