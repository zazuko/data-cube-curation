import { Constructor, RdfResource, property } from '@tpluscode/rdfine'
import { schema } from '@tpluscode/rdf-ns-builders'
import * as Table from './index'
import { dataCube } from '../namespaces'

export function ColumnMixin<TBase extends Constructor> (Base: TBase) {
  class Column extends Base implements Table.Column {
    @property.literal({ path: schema.name })
    public name!: string
  }

  return Column
}

ColumnMixin.shouldApply = (node: RdfResource) => {
  return node.hasType(dataCube.Column)
}
