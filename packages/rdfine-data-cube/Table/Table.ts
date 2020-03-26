import { namespace, property, RdfResource, Constructor, RdfResourceImpl } from '@tpluscode/rdfine'
import * as Csvw from '@rdfine/csvw'
import CsvwMappingMixin from '@rdfine/csvw/Csvw'
import urlSlug from 'url-slug'
import * as Table from './index'
import { dataCube, rdf, api, schema } from '../namespaces'
import './Attribute'
import { ProjectMixin } from '../Project'
import * as DataCube from '../'
import { SourceMixin } from '../Source'
import { parse } from '../lib/uriTemplateParser'
import { Initializer, ResourceNode } from '@tpluscode/rdfine/lib/RdfResource'

export function TableMixin<TBase extends Constructor> (Base: TBase) {
  class T extends Base implements Table.Table {
    @property.resource({ path: [ dataCube.source, dataCube.column ], values: 'array' })
    public readonly columns!: Table.Column[]

    @property.resource({ path: dataCube.project, as: [ ProjectMixin ] })
    public project!: DataCube.Project

    @property.resource({ path: dataCube.source, as: [ SourceMixin ] })
    public readonly source: DataCube.Source

    @property.resource({ path: api.csvwMetadata, as: [ CsvwMappingMixin ] })
    public readonly csvw!: Csvw.Mapping

    @property.literal({ path: schema('name') })
    public name!: string

    public get attributes () {
      return this._selfGraph.in(dataCube.table)
        .has(rdf.type, dataCube.Attribute)
        .map(attr => {
          return this._create<Table.Attribute>(attr)
        })
    }

    public createIdentifier (): string | null {
      throw new Error(`Abstract method. The table <${this.id.value}> should be either a FactTable or DimensionTable`)
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

    public createIdentifier () {
      return parse(this.identifierTemplate).toAbsoluteUrl(this.project.baseUri)
    }
  }

  return DimensionTable
}

DimensionTableMixin.shouldApply = (node: RdfResource) => {
  return node.hasType(dataCube.DimensionTable)
}

export function FactTableMixin<TBase extends Constructor> (Base: TBase) {
  function usedInReference (this: FactTable, column: Table.Column) {
    return this.attributes
      .some((attribute: Table.ReferenceAttribute | Table.Attribute) => {
        if (!('columnMappings' in attribute)) {
          return false
        }

        return attribute.columnMappings.some(mapping => mapping.sourceColumn.id.equals(column.id))
      })
  }

  @namespace(dataCube)
  class FactTable extends TableMixin(Base) {
    public createIdentifier () {
      const referencedColumns = this.source.columns
        .sort(column => column.order)
        .filter(usedInReference.bind(this))
        .map(column => `{${column.name}}`)

      if (!referencedColumns.some(Boolean)) {
        return null
      }

      const path = [
        urlSlug(this.name),
        ...referencedColumns,
      ].join('/')

      return this.project.baseUri + path
    }
  }

  return FactTable
}

FactTableMixin.shouldApply = (node: RdfResource) => {
  return node.hasType(dataCube.FactTable)
}
FactTableMixin.Class = class extends FactTableMixin(RdfResourceImpl) {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (node: ResourceNode, init: Initializer<Table.Table>) {
    super(node, init)
  }
}
DimensionTableMixin.Class = class extends DimensionTableMixin(RdfResourceImpl) {
  constructor (node: ResourceNode, init: Initializer<Table.DimensionTable>) {
    super(node, init)
    this.types.add(dataCube.DimensionTable)
  }
}
