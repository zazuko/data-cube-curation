import $rdf from 'rdf-ext'
import * as Table from './index'
import { dataCube, rdf } from '../../namespaces'
import TypedClownfaceEntity from '../TypedClownfaceEntity'
import { literal, namespace, property } from '../decorators'
import { Constructor, factory } from '../TypedEntityFactory'
import './Attribute'
import { ProjectMixin } from '../Project'
import * as DataCube from '../'
import Clownface = require('clownface/lib/Clownface')

@namespace(dataCube)
export class BaseTable extends TypedClownfaceEntity implements Table.Table {
  public constructor (dataset: Clownface | unknown, tableId?: string) {
    if (dataset instanceof Clownface) {
      super(dataset)
    } else {
      super({
        dataset, term: $rdf.namedNode(tableId),
      })
    }
  }

  @property({ path: [ dataCube.source, dataCube.column ], array: true })
  public readonly columns: Table.Column[]

  @property({ path: dataCube.project, as: [ ProjectMixin ] })
  public readonly project: DataCube.Project

  public get attributes () {
    return this.in(dataCube.table)
      .has(rdf.type, dataCube.Attribute)
      .map(attr => {
        return factory.createEntity<Table.Attribute>(attr)
      })
  }
}

function DimensionTableMixin<TBase extends Constructor<BaseTable>> (Base: TBase) {
  @namespace(dataCube)
  class DimensionTable extends Base implements Table.DimensionTable {
    @literal()
    public identifierTemplate: string
  }

  return DimensionTable
}

DimensionTableMixin.shouldApply = (node: TypedClownfaceEntity) => {
  return node.hasType(dataCube.DimensionTable)
}

factory.addMixin(DimensionTableMixin)
