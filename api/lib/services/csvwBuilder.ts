import cf from 'clownface'
import $rdf from 'rdf-ext'
import { csvw, rdf, dataCube, schema } from '../namespaces'

function addDialect (csvwGraph: any) {
  csvwGraph.addOut(csvw.dialect, dialect => {
    dialect.addOut(csvw.header, true)
    dialect.addOut(csvw.delimiter, ';')
    dialect.addOut(csvw.quoteChar, '"')
  })
}

function createColumn (csvwGraph: any, column: any, attribute?: any) {
  let csvwColumn = csvwGraph.blankNode()
    .addOut(csvw.title, column.out(schema.name).value)

  if (!attribute.value) {
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
  const tableContext = cf(tableDataset, $rdf.namedNode(tableId))
  const csvwGraph = cf($rdf.dataset(), $rdf.namedNode(`${tableId}/csvw`))
  csvwGraph.addOut(rdf.type, csvw.CsvwMapping)

  addDialect(csvwGraph)

  csvwGraph.addOut(csvw.tableSchema, tableSchema => {
    tableSchema.addList(csvw.column, tableContext
      .out(dataCube.source)
      .out(dataCube.column)
      .map(column => {
        const attribute = tableContext.in(dataCube.table).has(dataCube.column, column)
        return createColumn(csvwGraph, column, attribute)
      }))
  })

  return csvwGraph.dataset
}
