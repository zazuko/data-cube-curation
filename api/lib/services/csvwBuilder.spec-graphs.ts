import { turtle } from '@tpluscode/rdf-string'
import { dtype, schema, xsd } from '@tpluscode/rdf-ns-builders'
import { parseGraph } from '../__tests-helpers__'
import { dataCube } from '../namespaces'

export const ids = {
  tableId: 'http://example.com/table/Observation',
  sourceId: 'http://example.com/source/UBD0028.Daten_de.csv',
}

const base = 'http://reference-attribute.test/fact-table'

const tableAndSource = turtle`
<http://example.com/project> ${dataCube.baseUri} "http://cube.data/project#" .

<${ids.tableId}>
      a                 ${dataCube.FactTable} , ${dataCube.Table} ;
      ${dataCube.source}   <${ids.sourceId}> ;
      ${dataCube.project}   <http://example.com/project> .

<${ids.sourceId}>
      a                         ${dataCube.CsvSource} , ${dataCube.Source} ;
      ${schema.name}  "UBD0028.Daten_de.csv" ;
      ${dataCube.csvQuote}         "\\"" ;
      ${dataCube.csvDelimiter}     ";" .`

const unmappedColumn = turtle`${tableAndSource}

<${ids.sourceId}>
      ${dataCube.column}           <http://example.com/column/station_name> .

<http://example.com/column/station_name>
      a ${dataCube.Column} ;
      ${schema.name}  "station_name" .
`

const mappedColumn = turtle`${tableAndSource}

<${ids.sourceId}>      ${dataCube.column}           <http://example.com/column/station_name> .

<http://example.com/column/station_name>
      a ${dataCube.Column} ;
      ${schema.name}  "station_name" .


<http://example.com/attribute/station_name>
      a ${dataCube.Attribute}, ${dataCube.ValueAttribute} ;
      ${dataCube.column} <http://example.com/column/station_name> ;
      ${dataCube.table} <${ids.tableId}> ;
      ${dataCube.propertyTemplate} ${schema.name} .
`

const multipleMappedColumns = turtle`${mappedColumn}

<http://example.com/attribute/station_name_with_lang>
      a ${dataCube.Attribute}, ${dataCube.ValueAttribute} ;
      ${dataCube.column} <http://example.com/column/station_name> ;
      ${dataCube.table} <${ids.tableId}> ;
      ${dataCube.propertyTemplate} ${schema.name} ;
      ${dataCube.language} "fr" .
`

const columnMappedWithDatatype = turtle`${mappedColumn}

<http://example.com/attribute/station_name>
      ${dataCube.datatype} ${xsd.TOKEN} .
`

const columnMappedWithLanguage = turtle`${mappedColumn}

<http://example.com/attribute/station_name>
      ${dataCube.language} "en" .
`

const referenceAttribute = turtle`
<project> ${dataCube.baseUri} "http://cube.data/project/" .

<fact-table>
    a ${dataCube.FactTable}, ${dataCube.Table} ;
    ${schema.name} "a-fact" ;
    ${dataCube.source} [
        a ${dataCube.CsvSource} ;
        ${dataCube.column} <fact-source/name-column> , <fact-source/id-column> ;
        ${dataCube.csvQuote} "\\"" ; ${dataCube.csvDelimiter} ";" ;
    ] ;
    ${dataCube.project} <project> ;
.

<fact-source/name-column> a ${dataCube.Column} ; ${schema.name} "name" ; ${dtype.order} 0 .
<fact-source/id-column> a ${dataCube.Column} ; ${schema.name} "the-identifier" ; ${dtype.order} 1 .

<dim-table>
    a ${dataCube.DimensionTable}, ${dataCube.Table} ;
    ${dataCube.identifierTemplate} "http://example.com/{station_id}/{station_name}/" ;
    ${dataCube.source} [
        ${dataCube.column} <dim-source/name-column>, <dim-source/id-column>
    ] ;
    ${dataCube.project} <project> ;
.

<dim-source/name-column> a ${dataCube.Column} ; ${schema.name} "station_name" .
<dim-source/id-column> a ${dataCube.Column} ; ${schema.name} "station_id" .

<attribute/station_id>
    a ${dataCube.Attribute}, ${dataCube.ReferenceAttribute} ;
    ${dataCube.table} <fact-table> ;
    ${dataCube.referencedTable} <dim-table> ;
    ${dataCube.propertyTemplate} ${schema.identifier} ;
    ${dataCube.columnMapping} [
        ${dataCube.sourceColumn} <fact-source/name-column> ;
        ${dataCube.referencedColumn} <dim-source/name-column> ;
    ], [
        ${dataCube.sourceColumn} <fact-source/id-column> ;
        ${dataCube.referencedColumn} <dim-source/id-column> ;
    ] ;
.`

export const unmappedColumnGraph = parseGraph(unmappedColumn, base)
export const mappedColumnGraph = parseGraph(mappedColumn, base)
export const multipleMappedColumnsGraph = parseGraph(multipleMappedColumns, base)
export const columnMappedWithDatatypeGraph = parseGraph(columnMappedWithDatatype, base)
export const columnMappedWithLanguageGraph = parseGraph(columnMappedWithLanguage, base)
export const referenceAttributeGraph = parseGraph(referenceAttribute, base)
