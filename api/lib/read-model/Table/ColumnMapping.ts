import * as Table from './index'
import { dataCube } from '../../namespaces'
import './Column'
import { namespace, property } from '../decorators'
import { Constructor, factory } from '../TypedEntityFactory'
import Clownface from 'clownface/lib/Clownface'

function ColumnMappingMixin<TBase extends Constructor> (Base: TBase) {
  @namespace(dataCube)
  class ColumnMapping extends Base implements Table.ColumnMapping {
    @property()
    public readonly referencedColumn: Table.Column

    @property()
    public readonly sourceColumn: Table.Column
  }

  return ColumnMapping
}

ColumnMappingMixin.shouldApply = (term: Clownface) =>
  term.out([ dataCube.referencedColumn, dataCube.sourceColumn ]).terms.length > 1

factory.addMixin(ColumnMappingMixin)
