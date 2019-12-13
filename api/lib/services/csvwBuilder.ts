import cf from 'clownface'
import Clownface from 'clownface/lib/Clownface'
import $rdf from 'rdf-ext'
import { Dataset } from 'rdf-js'
import { csvw, rdf, dataCube, schema } from '../namespaces'

function addDialect (csvwGraph: Clownface) {
  csvwGraph.addOut(csvw.dialect, dialect => {
    dialect.addOut(csvw.header, true)
    dialect.addOut(csvw.delimiter, ';')
    dialect.addOut(csvw.quoteChar, '"')
  })
}

function createColumn (csvwGraph: Clownface, column: Clownface, attribute?: Clownface) {
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

export function buildCsvw (tableDataset: Dataset, tableId: string) {
  const tableContext = cf({ dataset: tableDataset, term: $rdf.namedNode(tableId) })
  const csvwGraph = cf({ dataset: $rdf.dataset(), term: $rdf.namedNode(`${tableId}/csvw`) })
  csvwGraph.addOut(rdf.type, csvw.CsvwMapping)

  addDialect(csvwGraph)

  csvwGraph.addOut(csvw.tableSchema, tableSchema => {
    const columnsAndAttributes = tableContext
      .out(dataCube.source)
      .out(dataCube.column)
      .toArray()

    tableSchema.addList(csvw.column, columnsAndAttributes
      .reduce(function matchColumnsToAttributes (previousValue, column) {
        const attributes = tableContext.in(dataCube.table).has(dataCube.column, column)
        if (attributes.values.length > 0) {
          return [...previousValue, ...attributes.map(attribute => ({
            column, attribute,
          }))]
        }

        return [...previousValue, { column }]
      }, [] as { column: Clownface; attribute?: Clownface }[])
      .map(({ column, attribute }) => {
        return createColumn(csvwGraph, column, attribute)
      }))
  })

  return csvwGraph.dataset
}
