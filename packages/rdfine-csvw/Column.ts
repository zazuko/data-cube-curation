import { Constructor, namespace, property, RdfResource } from '@tpluscode/rdfine'
import { csvw } from './namespaces'
import * as Csvw from './index'

export function ColumnMixin<TBase extends Constructor> (Base: TBase) {
  @namespace(csvw)
  abstract class Column extends Base implements Csvw.Column {
    @property.literal()
    public propertyUrl: string;

    @property.literal({ path: csvw.lang })
    public language: string;

    @property.resource()
    public datatype: RdfResource;

    @property.literal()
    public default: string;

    @property.literal()
    public valueUrl: string;

    @property.literal()
    public title: string;

    @property.literal({ path: csvw.suppressOutput, type: Boolean })
    public suppressed: boolean;
  }

  return Column
}
