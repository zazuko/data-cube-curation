import $rdf from 'rdf-ext'
import DatasetExt from 'rdf-ext/lib/Dataset'
import { DatasetCore } from 'rdf-js'
import cf from 'clownface'
import { RdfResourceImpl } from '@tpluscode/rdfine'
import CsvwGraphMixin from '@rdfine/csvw/Csvw'
import * as Csvw from '@rdfine/csvw'
import { valueAttributeToCsvwColumn } from './csvwBuilder/valueAttribute'
import { referenceAttributeToCsvwColumn } from './csvwBuilder/referenceAttribute'
import { error } from '../log'
import * as DataCube from '@zazuko/rdfine-data-cube'
import { TableMixin } from '@zazuko/rdfine-data-cube/Table/Table'
import { getAbsoluteUrl } from './csvwBuilder/aboutUrl'
import { wireUp } from '@zazuko/rdfine-data-cube/wireUp'
import { parse } from './uriTemplateParser'

type Attribute = DataCube.ReferenceAttribute | DataCube.ValueAttribute | DataCube.Attribute

wireUp(RdfResourceImpl.factory)

function createCsvwColumn (csvwGraph: Csvw.Mapping, table: DataCube.Table, attribute: Attribute): Csvw.Column | null {
  let csvwColumn: Csvw.Column | null = null

  if ('column' in attribute) {
    csvwColumn = csvwGraph.newColumn({
      name: attribute.column.name,
    })

    csvwColumn = valueAttributeToCsvwColumn(attribute, csvwColumn)
  }

  if ('columnMappings' in attribute) {
    const column = attribute.columnMappings[0].sourceColumn
    csvwColumn = csvwGraph.newColumn({
      name: column.name,
    })

    csvwColumn = referenceAttributeToCsvwColumn(attribute, csvwColumn)
  }

  if (csvwColumn) {
    const propertyTemplate = attribute.propertyTemplate
    const parsed = parse(propertyTemplate)
    csvwColumn.propertyUrl = getAbsoluteUrl(table.project, parsed)
    return csvwColumn
  }

  error(`The types of <%s> did not contain one of the expected datacube:Attribute types`, attribute.id)
  return null
}

export function buildCsvw (tableOrDataset: DataCube.Table | DataCube.DimensionTable | { dataset: DatasetCore; tableId: string }): Csvw.Mapping<DatasetExt> {
  let table: DataCube.Table | DataCube.DimensionTable
  if ('dataset' in tableOrDataset) {
    table = RdfResourceImpl.factory.createEntity(cf({
      dataset: tableOrDataset.dataset,
      term: $rdf.namedNode(tableOrDataset.tableId),
    }), [TableMixin])
  } else {
    table = tableOrDataset
  }

  const csvwGraph = RdfResourceImpl.factory.createEntity<Csvw.Mapping<DatasetExt>>(cf({
    dataset: $rdf.dataset(),
    term: $rdf.namedNode(`${table.id.value}/csvw`),
  }), [CsvwGraphMixin])

  const source: DataCube.Source | DataCube.CsvSource = table.source
  if ('delimiter' in source) {
    csvwGraph.addDialect(source)
  } else {
    csvwGraph.addDialect()
  }
  csvwGraph.url = table.source.name

  if ('identifierTemplate' in table && table.identifierTemplate) {
    const parsed = parse(table.identifierTemplate)
    csvwGraph.tableSchema.aboutUrl = getAbsoluteUrl(table.project, parsed)
  }

  const attributes: Attribute[] = table.attributes
  const mappedColumns = attributes.reduce((columns, attr) => {
    const column = createCsvwColumn(csvwGraph, table, attr)

    if (column) {
      columns.push(column)
    }

    return columns
  }, [] as Csvw.Column[])

  const suppressedColumns = table.columns.reduce((mapped, column: DataCube.Column) => {
    if (!mappedColumns.find(c => c.title === column.name)) {
      const csvwColumn = csvwGraph.newColumn({
        name: column.name,
      })
      csvwColumn.suppressed = true

      mapped.push(csvwColumn)
    }

    return mapped
  }, [] as Csvw.Column[])

  csvwGraph.tableSchema.columns = [...mappedColumns, ...suppressedColumns]

  return csvwGraph
}
