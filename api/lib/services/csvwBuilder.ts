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
  const tableContext = cf(tableDataset, $rdf.namedNode(tableId))
  const csvwGraph = cf($rdf.dataset(), $rdf.namedNode(`${tableId}/csvw`))
  csvwGraph.addOut(rdf.type, csvw.CsvwMapping)

  addDialect(csvwGraph)

  csvwGraph.addOut(csvw.tableSchema, tableSchema => {
    const columnsAndAttributes: [] = tableContext
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
      }, [])
      .map(({ column, attribute }) => {
        return createColumn(csvwGraph, column, attribute)
      }))
  })

  return csvwGraph.dataset
}
