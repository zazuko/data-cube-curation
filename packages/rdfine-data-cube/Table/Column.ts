import { Constructor, RdfResource, property, RdfResourceImpl } from '@tpluscode/rdfine'
import { ResourceNode } from '@tpluscode/rdfine/lib/RdfResource'
import * as Table from './index'
import { dataCube, schema, dtype } from '../namespaces'

export function ColumnMixin<TBase extends Constructor> (Base: TBase) {
  class Column extends Base implements Table.Column {
    @property.literal({ path: schema.name })
    public name!: string

    @property.literal({ path: dtype.order, type: Number })
    public order!: number
  }

  return Column
}

ColumnMixin.shouldApply = (node: RdfResource) => {
  return node.hasType(dataCube.Column)
}

ColumnMixin.Class = class ColumnMixinImpl extends ColumnMixin(RdfResourceImpl) {
  constructor (node: ResourceNode, initializer?: Partial<Table.Column>) {
    super(node, initializer)

    this.types.add(dataCube.Column)
  }
}
