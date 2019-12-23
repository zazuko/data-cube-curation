import { Constructor, RdfResource, factory, property } from '@tpluscode/rdfine'
import * as Table from './index'
import { dataCube, schema } from '../../namespaces'

function ColumnMixin<TBase extends Constructor> (Base: TBase) {
  class Column extends Base implements Table.Column {
    @property.literal({ path: schema.name })
    public name: string
  }

  return Column
}

ColumnMixin.shouldApply = (node: RdfResource) => {
  return node.hasType(dataCube.Column)
}

factory.addMixin(ColumnMixin)
