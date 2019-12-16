import Entity, { TypedClownfaceEntity } from '../TypedClownfaceEntity'
import { literal, namespace, property } from '../decorators'
import * as Table from './index'
import { dataCube, rdf } from '../../namespaces'
import './ColumnMapping'
import { Constructor, factory } from '../TypedEntityFactory'

function AttributeMixin<TBase extends Constructor> (Base: TBase) {
  @namespace(dataCube)
  class Attribute extends Base implements Table.Attribute {
    @literal({ path: rdf.predicate })
    public predicate: string
  }

  return Attribute
}

function ValueAttributeMixin<TBase extends Constructor<Entity & Table.Attribute>> (Base: TBase) {
  class ValueAttribute extends Base implements Table.ValueAttribute {
    @property()
    public datatype: TypedClownfaceEntity

    @literal()
    public language: string
  }

  return AttributeMixin(ValueAttribute)
}
function ReferenceAttributeMixin<TBase extends Constructor<Entity & Table.Attribute>> (Base: TBase) {
  class ReferenceAttribute extends Base implements Table.ReferenceAttribute {
    @property()
    public referencedTable: Table.DimensionTable

    @property({ path: dataCube.columnMapping, array: true })
    public readonly columnMappings: Table.ColumnMapping[]
  }

  return AttributeMixin(ReferenceAttribute)
}

AttributeMixin.shouldApply = (cf: Entity) => {
  return cf.hasType(dataCube.Attribute)
}

ValueAttributeMixin.shouldApply = (cf: Entity) => {
  return cf.hasType(dataCube.ValueAttribute)
}

ReferenceAttributeMixin.shouldApply = (cf: Entity) => {
  return cf.hasType(dataCube.ReferenceAttribute)
}

factory.addMixin(AttributeMixin)
factory.addMixin(ValueAttributeMixin)
factory.addMixin(ReferenceAttributeMixin)
