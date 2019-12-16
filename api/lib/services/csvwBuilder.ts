import $rdf from 'rdf-ext'
import { valueAttributeToCsvwColumn } from './csvwBuilder/valueAttribute'
import { referenceAttributeToCsvwColumn } from './csvwBuilder/referenceAttribute'
import { error } from '../log'
import CsvwGraph from './csvwBuilder/Csvw'
import * as Table from '../read-model/Table'
import { BaseTable } from '../read-model/Table/Table'
import * as Csvw from './csvwBuilder/index'
import { dataCube } from '../namespaces'

function createCsvwColumn (csvwGraph: Csvw.Mapping, column: Table.Column, attribute?: Table.Attribute): Csvw.Column {
  let csvwColumn = csvwGraph.newColumn({
    name: column.name,
  })

  if (!attribute) {
    csvwColumn.suppressed = true
    return csvwColumn
  }

  csvwColumn.propertyUrl = attribute.predicate

  if (attribute.hasType(dataCube.ValueAttribute)) {
    return valueAttributeToCsvwColumn(attribute as Table.ValueAttribute, csvwColumn)
  }

  if (attribute.hasType(dataCube.ReferenceAttribute)) {
    return referenceAttributeToCsvwColumn(attribute as Table.ReferenceAttribute, csvwColumn)
  }

  error(`The types of <%s> did not contain one of the expected datacube:Attribute types`, attribute.id)
  return csvwColumn
}

export function buildCsvw (tableDataset: any, tableId: string) {
  const table = new BaseTable(tableDataset, tableId)
  const csvwGraph = new CsvwGraph({ dataset: $rdf.dataset(), term: $rdf.namedNode(`${tableId}/csvw`) })

  csvwGraph.addDialect()

  const doneAttributes: string[] = []

  csvwGraph.tableSchema.columns = table.columns
    .reduce(function matchColumnsToAttributes (previousColumns, column) {
      let nextColumns: Csvw.Column[]

      nextColumns = table.attributes
        .filter(attr => !doneAttributes.includes(attr.id.value))
        .map(attr => {
          doneAttributes.push(attr.id.value)
          return createCsvwColumn(csvwGraph, column, attr)
        })

      if (nextColumns.length === 0) {
        nextColumns = [ createCsvwColumn(csvwGraph, column) ]
      }

      return [ ...previousColumns, ...nextColumns ]
    }, [] as Csvw.Column[])

  return csvwGraph.dataset
}
