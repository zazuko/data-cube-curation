import cf from 'clownface'
import Clownface from 'clownface/lib/Clownface'
import $rdf from 'rdf-ext'
import { Dataset } from 'rdf-js'
import { csvw, rdf, dataCube, schema } from '../namespaces'
import { valueAttributeToCsvwColumn } from './csvwBuilder/valueAttribute'
import { referenceAttributeToCsvwColumn } from './csvwBuilder/referenceAttribute'
import { error } from '../log'

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

  csvwColumn.addOut(csvw.propertyUrl, attribute.out(rdf.predicate).value)

  const attributeTypes = attribute.out(rdf.type).terms

  if (attributeTypes.find(t => t.equals(dataCube.ValueAttribute))) {
    return valueAttributeToCsvwColumn(attribute, csvwColumn)
  }

  if (attributeTypes.find(t => t.equals(dataCube.ReferenceAttribute))) {
    return referenceAttributeToCsvwColumn(attribute, csvwColumn)
  }

  error(`The types of <%s> did not contain one of the expected datacube:Attribute types`, attribute.value)
  return csvwColumn
}

export function buildCsvw (tableDataset: Dataset, tableId: string) {
  const tableContext = cf({ dataset: tableDataset, term: $rdf.namedNode(tableId) })
  const csvwGraph = cf({ dataset: $rdf.dataset(), term: $rdf.namedNode(`${tableId}/csvw`) })
  csvwGraph.addOut(rdf.type, csvw.CsvwMapping)

  addDialect(csvwGraph)

  csvwGraph.addOut(csvw.tableSchema, tableSchema => {
    const columns = tableContext
      .out(dataCube.source)
      .out(dataCube.column)
      .toArray()

    const doneAttributes: string[] = []

    const csvwColumns = columns
      .reduce(function matchColumnsToAttributes (previousColumns, column) {
        let nextColumns: Clownface[]
        const attributes = tableContext.in(dataCube.table)
          .has(rdf.type, dataCube.Attribute)

        nextColumns = attributes
          .filter(attr => !doneAttributes.includes(attr.value))
          .map(attr => {
            doneAttributes.push(attr.value)
            return createCsvwColumn(csvwGraph, column, attr)
          })

        if (nextColumns.length === 0) {
          nextColumns = [ createCsvwColumn(csvwGraph, column) ]
        }

        return [...previousColumns, { column }]
      }, [] as { column: Clownface; attribute?: Clownface }[])
      .map(({ column, attribute }) => {
        return createCsvwColumn(csvwGraph, column, attribute)
      })

    tableSchema.addList(csvw.columns, csvwColumns)
  })

  return csvwGraph.dataset
}
