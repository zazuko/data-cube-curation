import { namespace, property, RdfResource, Constructor } from '@tpluscode/rdfine'
import * as Csvw from '@rdfine/csvw'
import CsvwMappingMixin from '@rdfine/csvw/Csvw'
import * as Table from './index'
import { dataCube, rdf, api } from '../namespaces'
import './Attribute'
import { ProjectMixin } from '../Project'
import * as DataCube from '../'
import { SourceMixin } from '../Source'

export function TableMixin<TBase extends Constructor> (Base: TBase) {
  class T extends Base implements Table.Table {
    @property.resource({ path: [ dataCube.source, dataCube.column ], values: 'array' })
    public readonly columns!: Table.Column[]

    @property.resource({ path: dataCube.project, as: [ ProjectMixin ] })
    public readonly project!: DataCube.Project

    @property.resource({ path: dataCube.source, as: [ SourceMixin ] })
    public readonly source: DataCube.Source

    @property.resource({ path: api.csvwMetadata, as: [ CsvwMappingMixin ] })
    public readonly csvw!: Csvw.Mapping

    public get attributes () {
      return this._selfGraph.in(dataCube.table)
        .has(rdf.type, dataCube.Attribute)
        .map(attr => {
          return this._create<Table.Attribute>(attr)
        })
    }
  }

  return T
}

TableMixin.shouldApply = (res: RdfResource) => res.hasType(dataCube.Table)

export function DimensionTableMixin<TBase extends Constructor> (Base: TBase) {
  @namespace(dataCube)
  class DimensionTable extends TableMixin(Base) implements Table.DimensionTable {
    @property.literal()
    public identifierTemplate: string
  }

  return DimensionTable
}

DimensionTableMixin.shouldApply = (node: RdfResource) => {
  return node.hasType(dataCube.DimensionTable)
}
