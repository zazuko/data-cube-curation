import { namespace, property, RdfResourceImpl, RdfResource, Constructor } from '@tpluscode/rdfine'
import * as Table from './index'
import { dataCube, rdf } from '../../namespaces'
import './Attribute'
import { ProjectMixin } from '../Project'
import * as DataCube from '../'
import { SourceMixin } from '../Source'

@namespace(dataCube)
export class BaseTable extends RdfResourceImpl implements Table.Table {
  @property.resource({ path: [ dataCube.source, dataCube.column ], values: 'array' })
  public readonly columns: Table.Column[]

  @property.resource({ path: dataCube.project, as: [ ProjectMixin ] })
  public readonly project: DataCube.Project

  @property.resource({ path: dataCube.source, as: [ SourceMixin ] })
  public readonly source: DataCube.Source

  public get attributes () {
    return this._node.in(dataCube.table)
      .has(rdf.type, dataCube.Attribute)
      .map(attr => {
        return RdfResourceImpl.factory.createEntity<Table.Attribute>(attr)
      })
  }
}

export function DimensionTableMixin<TBase extends Constructor<BaseTable>> (Base: TBase) {
  @namespace(dataCube)
  class DimensionTable extends Base implements Table.DimensionTable {
    @property.literal()
    public identifierTemplate: string
  }

  return DimensionTable
}

DimensionTableMixin.shouldApply = (node: RdfResource) => {
  return node.hasType(dataCube.DimensionTable)
}
