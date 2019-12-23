import { RdfResourceImpl, factory } from '@tpluscode/rdfine'
import { csvw, rdf } from '../../namespaces'
import * as Csvw from './index'
import { TableSchema } from './TableSchema'
import { DatasetCore, NamedNode } from 'rdf-js'
import { ColumnMixin } from './Column'
import { SingleContextClownface, Clownface } from 'clownface'

export default class <D extends DatasetCore> extends RdfResourceImpl<D> implements Csvw.Mapping {
  public constructor (o: { dataset: D; term: NamedNode }) {
    super(o)

    this._node.addOut(rdf.type, csvw.CsvwMapping)
  }

  public get tableSchema () {
    let node: SingleContextClownface | Clownface = this._node.out(csvw.tableSchema)
    if (!node.term) {
      this._node.addOut(csvw.tableSchema, newNode => {
        node = newNode
      })
    }

    return new TableSchema(node as any as SingleContextClownface)
  }

  public addDialect () {
    this._node.addOut(csvw.dialect, dialect => {
      dialect.addOut(csvw.header, true)
      dialect.addOut(csvw.delimiter, ';')
      dialect.addOut(csvw.quoteChar, '"')
    })
  }

  public newColumn (col: { name: string }) {
    const node = this._node.blankNode().addOut(csvw.title, col.name)

    return factory.createEntity<Csvw.Column>(node, [ ColumnMixin ])
  }
}
