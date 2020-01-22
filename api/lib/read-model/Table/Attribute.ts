import { Constructor, namespace, property, RdfResource, RdfResourceImpl } from '@tpluscode/rdfine'
import * as Table from './index'
import { dataCube } from '../../namespaces'
import './ColumnMapping'
import { BaseTable } from './Table'

function AttributeMixin<TBase extends Constructor> (Base: TBase) {
  @namespace(dataCube)
  class Attribute extends Base implements Table.Attribute {
    @property.literal()
    public propertyTemplate: string
  }

  return Attribute
}

function ValueAttributeMixin<TBase extends Constructor<Table.Attribute>> (Base: TBase) {
  class ValueAttribute extends Base implements Table.ValueAttribute {
    @property.resource()
    public datatype: RdfResource

    @property.literal()
    public language: string

    @property.resource()
    public column: Table.Column

    public get parameters () {
      const prop = dataCube('datatype/parameters')

      return this._node.out(prop)
        .toArray()
        .reduce((params, param) => {
          [...this._node.dataset.match(param.term)]
            .forEach(quad => {
              const csvwProperty = quad.predicate.value.replace(dataCube('datatype/').value, '')
              params[csvwProperty] = quad.object.value
            })

          return params
        }, {} as Record<string, string>)
    }
  }

  return AttributeMixin(ValueAttribute)
}
function ReferenceAttributeMixin<TBase extends Constructor<Table.Attribute>> (Base: TBase) {
  class ReferenceAttribute extends Base implements Table.ReferenceAttribute {
    @property.resource({ as: [ BaseTable ] })
    public referencedTable: Table.DimensionTable

    @property.resource({ path: dataCube.columnMapping, values: 'array' })
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

RdfResourceImpl.factory.addMixin(AttributeMixin)
RdfResourceImpl.factory.addMixin(ValueAttributeMixin)
RdfResourceImpl.factory.addMixin(ReferenceAttributeMixin)
