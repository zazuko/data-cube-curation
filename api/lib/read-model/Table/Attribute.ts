import { Constructor, namespace, property, RdfResource, factory } from '@tpluscode/rdfine'
import * as Table from './index'
import { dataCube, rdf } from '../../namespaces'
import './ColumnMapping'

function AttributeMixin<TBase extends Constructor> (Base: TBase) {
  @namespace(dataCube)
  class Attribute extends Base implements Table.Attribute {
    @property.literal({ path: rdf.predicate })
    public predicate: string
  }

  return Attribute
}

function ValueAttributeMixin<TBase extends Constructor<Table.Attribute>> (Base: TBase) {
  class ValueAttribute extends Base implements Table.ValueAttribute {
    @property.resource()
    public datatype: RdfResource

    @property.literal()
    public language: string
  }

  return AttributeMixin(ValueAttribute)
}
function ReferenceAttributeMixin<TBase extends Constructor<Table.Attribute>> (Base: TBase) {
  class ReferenceAttribute extends Base implements Table.ReferenceAttribute {
    @property.resource()
    public referencedTable: Table.DimensionTable

    @property.resource({ path: dataCube.columnMapping, array: true })
    public readonly columnMappings: Table.ColumnMapping[]
  }

  return AttributeMixin(ReferenceAttribute)
}

AttributeMixin.shouldApply = (cf: RdfResource) => {
  return cf.hasType(dataCube.Attribute)
}

ValueAttributeMixin.shouldApply = (cf: RdfResource) => {
  return cf.hasType(dataCube.ValueAttribute)
}

ReferenceAttributeMixin.shouldApply = (cf: RdfResource) => {
  return cf.hasType(dataCube.ReferenceAttribute)
}

factory.addMixin(AttributeMixin)
factory.addMixin(ValueAttributeMixin)
factory.addMixin(ReferenceAttributeMixin)
