import * as Table from './index'
import { dataCube, schema } from '../../namespaces'
import { literal } from '../decorators'
import { Constructor, factory } from '../TypedEntityFactory'
import TypedClownfaceEntity from '../TypedClownfaceEntity'

function ColumnMixin<TBase extends Constructor> (Base: TBase) {
  class Column extends Base implements Table.Column {
    @literal({ path: schema.name })
    public name: string
  }

  return Column
}

ColumnMixin.shouldApply = (node: TypedClownfaceEntity) => {
  return node.hasType(dataCube.Column)
}

factory.addMixin(ColumnMixin)
