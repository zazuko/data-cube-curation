import { namespace, RdfResourceImpl, property, Constructor, RdfResource } from '@tpluscode/rdfine'
import { NamedNode } from 'rdf-js'
import { csvw, rdf } from './namespaces'
import * as Csvw from './index'
import { TableSchemaMixin } from './TableSchema'
import { ColumnMixin } from './Column'

export default function CsvwMappingMixin<Base extends Constructor> (base: Base) {
  @namespace(csvw)
  class CsvwMapping extends base implements Csvw.Mapping {
    @property.literal()
    public url!: string

    @property({
      path: rdf.type,
    })
    public type!: NamedNode

    @property.resource({
      as: [TableSchemaMixin],
    })
    public tableSchema!: Csvw.TableSchema

    public addDialect () {
      this._node.addOut(csvw.dialect, dialect => {
        dialect.addOut(csvw.header, true)
        dialect.addOut(csvw.delimiter, ';')
        dialect.addOut(csvw.quoteChar, '"')
      })
    }

    public newColumn (col: { name: string }) {
      const node = this._node.blankNode().addOut(csvw.title, col.name)

      return RdfResourceImpl.factory.createEntity<Csvw.Column>(node, [ColumnMixin])
    }
  }

  return CsvwMapping
}

CsvwMappingMixin.shouldApply = (res: RdfResource) => res.hasType(csvw.CsvwMapping)
