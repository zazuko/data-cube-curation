import { namespace, property, Constructor } from '@tpluscode/rdfine'
import RdfResourceImpl from '@tpluscode/rdfine/RdfResource'
import { NamedNode } from 'rdf-js'
import { csvw, rdf } from '@tpluscode/rdf-ns-builders'
import * as Csvw from './index'
import { TableSchemaMixin } from './TableSchema'
import { ColumnMixin } from './Column'
import { CsvwDialectMixin } from './Dialect'

let bnCounter = 0

export default function CsvwMappingMixin<Base extends Constructor> (base: Base) {
  @namespace(csvw)
  class CsvwMapping extends base implements Csvw.Mapping {
    @property.literal()
    public url!: string

    @property({
      path: rdf.type,
      initial: csvw.CsvwMapping,
    })
    public type!: NamedNode

    @property.resource({
      as: [TableSchemaMixin],
      initial: (self) => self.pointer.blankNode(`tableSchema${++bnCounter}`),
    })
    public tableSchema!: Csvw.TableSchema

    @property.resource({
      as: [CsvwDialectMixin],
      initial: (self) => self.pointer.blankNode(`dialect${++bnCounter}`),
    })
    public dialect!: Csvw.Dialect

    public setDialect ({ delimiter, quote }: Pick<Csvw.Dialect, 'delimiter' | 'quote'>) {
      this.dialect.delimiter = delimiter
      this.dialect.quote = quote
    }

    public newColumn (col) {
      const node = this.pointer.blankNode(`column${++bnCounter}`)

      if (col?.name) {
        node.addOut(csvw.title, col.name)
      }

      return RdfResourceImpl.factory.createEntity<Csvw.Column>(node, [ColumnMixin])
    }
  }

  return CsvwMapping
}

CsvwMappingMixin.appliesTo = csvw.CsvwMapping
