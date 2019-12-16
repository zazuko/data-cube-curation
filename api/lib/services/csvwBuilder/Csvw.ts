import { csvw, rdf } from '../../namespaces'
import * as Csvw from './index'
import TypedClownfaceEntity from '../../read-model/TypedClownfaceEntity'
import { TableSchema } from './TableSchema'
import { Term } from 'rdf-js'
import { factory } from '../../read-model/TypedEntityFactory'
import { ColumnMixin } from './Column'

export default class extends TypedClownfaceEntity implements Csvw.Mapping {
  public constructor (o: { dataset: any; term: Term }) {
    super(o)

    this.addOut(rdf.type, csvw.CsvwMapping)
  }

  public get tableSchema () {
    let node = this.out(csvw.tableSchema)
    if (!node.term) {
      this.addOut(csvw.tableSchema, newNode => {
        node = newNode
      })
    }

    return new TableSchema(node)
  }

  public addDialect () {
    this.addOut(csvw.dialect, dialect => {
      dialect.addOut(csvw.header, true)
      dialect.addOut(csvw.delimiter, ';')
      dialect.addOut(csvw.quoteChar, '"')
    })
  }

  public newColumn (col: { name: string }) {
    const node = this.blankNode().addOut(csvw.title, col.name)

    return factory.createEntity<Csvw.Column>(node, [ ColumnMixin ])
  }
}
