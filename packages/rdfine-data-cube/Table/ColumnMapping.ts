import { Constructor, namespace, property, RdfResource } from '@tpluscode/rdfine'
import * as Table from './index'
import { dataCube } from '../namespaces'
import './Column'

export function ColumnMappingMixin<TBase extends Constructor> (Base: TBase) {
  @namespace(dataCube)
  class ColumnMapping extends Base implements Table.ColumnMapping {
    @property.resource()
    public readonly referencedColumn!: Table.Column

    @property.resource()
    public readonly sourceColumn!: Table.Column
  }

  return ColumnMapping
}

ColumnMappingMixin.shouldApply = (term: RdfResource) =>
  term.pointer.out([ dataCube.referencedColumn, dataCube.sourceColumn ]).terms.length > 1
