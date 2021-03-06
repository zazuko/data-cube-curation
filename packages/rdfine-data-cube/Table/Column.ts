import RdfResourceImpl, { Constructor, RdfResource, property } from '@tpluscode/rdfine'
import { schema, dtype } from '@tpluscode/rdf-ns-builders'
import { ResourceNode } from '@tpluscode/rdfine/RdfResource'
import * as Table from './index'
import { dataCube } from '../namespaces'

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
