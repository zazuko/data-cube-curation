import { csvw } from '../../namespaces'
import TypedClownfaceEntity from '../../read-model/TypedClownfaceEntity'
import * as Csvw from './index'

export class TableSchema extends TypedClownfaceEntity implements Csvw.TableSchema {
  public set columns (columns: Csvw.Column[]) {
    this.addList(csvw.column, columns)
  }
}
