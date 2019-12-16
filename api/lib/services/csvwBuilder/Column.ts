import { csvw } from '../../namespaces'
import * as Csvw from './index'
import TypedClownfaceEntity from '../../read-model/TypedClownfaceEntity'
import { namespace, literal, property } from '../../read-model/decorators'
import { Constructor } from '../../read-model/TypedEntityFactory'

export function ColumnMixin<TBase extends Constructor> (Base: TBase) {
  @namespace(csvw)
  abstract class Column extends Base implements Csvw.Column {
    @literal()
    public propertyUrl: string;

    @literal({ path: csvw.lang })
    public language: string;

    @property()
    public datatype: TypedClownfaceEntity;

    @property()
    public valueUrl: string;

    @literal()
    public title: string;

    @literal({ path: csvw.suppressOutput, type: Boolean })
    public suppressed: boolean;
  }

  return Column
}
