import cf from 'clownface'
import Clownface from 'clownface/lib/Clownface'
import $rdf from 'rdf-ext'
import { csvw, rdf, dataCube, schema } from '../namespaces'

function addDialect (csvwGraph: Clownface) {
  csvwGraph.addOut(csvw.dialect, dialect => {
    dialect.addOut(csvw.header, true)
    dialect.addOut(csvw.delimiter, ';')
    dialect.addOut(csvw.quoteChar, '"')
  })
}

function createCsvwColumn (csvwGraph: Clownface, column: Clownface, attribute?: Clownface) {
  let csvwColumn = csvwGraph.blankNode()
    .addOut(csvw.title, column.out(schema.name).value)

  if (!attribute) {
    return csvwColumn.addOut(csvw.suppressOutput, true)
  }

  if (attribute.out(dataCube.language).value) {
    csvwColumn = csvwColumn.addOut(csvw.lang, attribute.out(dataCube.language))
  } else if (attribute.out(dataCube.datatype).value) {
    csvwColumn = csvwColumn.addOut(csvw.datatype, attribute.out(dataCube.datatype))
  }

  return csvwColumn.addOut(csvw.propertyUrl, attribute.out(rdf.predicate).value)
}

export function buildCsvw (tableDataset: any, tableId: string) {
  const tableContext = cf({ dataset: tableDataset, term: $rdf.namedNode(tableId) })
  const csvwGraph = cf({ dataset: $rdf.dataset(), term: $rdf.namedNode(`${tableId}/csvw`) })
  csvwGraph.addOut(rdf.type, csvw.CsvwMapping)

  addDialect(csvwGraph)

  csvwGraph.addOut(csvw.tableSchema, tableSchema => {
    const columns = tableContext
      .out(dataCube.source)
      .out(dataCube.column)
      .toArray()

    const csvwColumns = columns
      .reduce(function matchColumnsToAttributes (previousColumns, column) {
        let nextColumns: Clownface[]
        const attributes = tableContext.in(dataCube.table)
          .has(rdf.type, dataCube.Attribute)

        if (attributes.terms.length === 0) {
          nextColumns = [ createCsvwColumn(csvwGraph, column) ]
        } else {
          nextColumns = attributes.map(a => createCsvwColumn(csvwGraph, column, a))
        }

        return [ ...previousColumns, ...nextColumns ]
      }, [])

    tableSchema.addList(csvw.column, csvwColumns)
  })

  return csvwGraph.dataset
}
