import RdfResourceImpl, { Constructor, namespace, property, RdfResource } from '@tpluscode/rdfine'
import { Initializer, ResourceNode } from '@tpluscode/rdfine/RdfResource'
import * as Table from './index'
import { dataCube } from '../namespaces'
import { TableMixin } from './Table'
import { ColumnMappingMixin } from './ColumnMapping'

function AttributeMixin<TBase extends Constructor> (Base: TBase) {
  @namespace(dataCube)
  class Attribute extends Base implements Table.Attribute {
    @property.literal()
    public propertyTemplate: string
  }

  return Attribute
}

export function ValueAttributeMixin<TBase extends Constructor<Table.Attribute>> (Base: TBase) {
  @namespace(dataCube)
  class ValueAttribute extends Base implements Table.ValueAttribute {
    @property.resource()
    public datatype: RdfResource

    @property.literal()
    public default: string

    @property.literal()
    public language: string

    @property.resource()
    public column: Table.Column

    public get parameters () {
      const prop = dataCube('datatype/parameters')

      return this.pointer.out(prop)
        .toArray()
        .reduce((params, param) => {
          [...this.pointer.dataset.match(param.term)]
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
export function ReferenceAttributeMixin<TBase extends Constructor<Table.Attribute>> (Base: TBase) {
  @namespace(dataCube)
  class ReferenceAttribute extends Base implements Table.ReferenceAttribute {
    @property.resource({ as: [ TableMixin ] })
    public referencedTable: Table.Table

    @property.resource({ path: dataCube.columnMapping, values: 'array', as: [ColumnMappingMixin] })
    public columnMappings: Table.ColumnMapping[]
  }

  return AttributeMixin(ReferenceAttribute)
}

AttributeMixin.appliesTo = dataCube.Attribute

ValueAttributeMixin.appliesTo = dataCube.ValueAttribute

ReferenceAttributeMixin.appliesTo = dataCube.ReferenceAttribute

ValueAttributeMixin.Class = class extends ValueAttributeMixin(AttributeMixin(RdfResourceImpl)) {
  constructor (node: ResourceNode, init?: Initializer<Table.ValueAttribute>) {
    super(node, init)

    this.types.add(dataCube.Attribute)
    this.types.add(dataCube.ValueAttribute)
  }
}

ReferenceAttributeMixin.Class = class extends ReferenceAttributeMixin(AttributeMixin(RdfResourceImpl)) {
  constructor (node: ResourceNode, init?: Initializer<Table.ReferenceAttribute>) {
    super(node, init)

    this.types.add(dataCube.Attribute)
    this.types.add(dataCube.ReferenceAttribute)
  }
}

export default [
  AttributeMixin,
  ValueAttributeMixin,
  ReferenceAttributeMixin,
]
