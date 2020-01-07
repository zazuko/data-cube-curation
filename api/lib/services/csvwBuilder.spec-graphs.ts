import { parseGraph } from '../__tests-helpers__'

export const ids = {
  tableId: 'http://example.com/table/Observation',
  sourceId: 'http://example.com/source/UBD0028.Daten_de.csv',
}

const tableAndSource = `
<${ids.tableId}>
      a                 dataCube:FactTable , dataCube:Table ;
      dataCube:source   <${ids.sourceId}> .

<${ids.sourceId}>
      a                         dataCube:CsvSource , dataCube:Source ;
      <http://schema.org/name>  "UBD0028.Daten_de.csv" .`

const unmappedColumn = `${tableAndSource}

<${ids.sourceId}>
      dataCube:column           <http://example.com/column/station_name> .

<http://example.com/column/station_name>
      a dataCube:Column ;
      <http://schema.org/name>  "station_name" .
`

const mappedColumn = `${tableAndSource}

<${ids.sourceId}>      dataCube:column           <http://example.com/column/station_name> .

<http://example.com/column/station_name>
      a dataCube:Column ;
      <http://schema.org/name>  "station_name" .


<http://example.com/attribute/station_name>
      a dataCube:Attribute, dataCube:ValueAttribute ;
      dataCube:column <http://example.com/column/station_name> ;
      dataCube:table <${ids.tableId}> ;
      rdf:predicate <http://schema.org/name> .
`

const multipleMappedColumns = `${mappedColumn}

<http://example.com/attribute/station_name_with_lang>
      a dataCube:Attribute, dataCube:ValueAttribute ;
      dataCube:column <http://example.com/column/station_name> ;
      dataCube:table <${ids.tableId}> ;
      rdf:predicate <http://schema.org/name> ;
      dataCube:language "fr" .
`

const columnMappedWithDatatype = `${mappedColumn}

<http://example.com/attribute/station_name>
      dataCube:datatype xsd:TOKEN .
`

const columnMappedWithLanguage = `${mappedColumn}

<http://example.com/attribute/station_name>
      dataCube:language "en" .
`

const referenceAttribute = `
BASE <http://reference-attribute.test/fact-table>

<fact-table>
    a dataCube:FactTable, dataCube:Table ;
    dataCube:source [
        dataCube:column <fact-source/name-column> , <fact-source/id-column> ;
    ] ;
.

<fact-source/name-column> a dataCube:Column ; schema:name "name" .
<fact-source/id-column> a dataCube:Column ; schema:name "the-identifier" .

<dim-table>
    a dataCube:DimensionTable, dataCube:Table ;
    dataCube:identifierTemplate "http://example.com/{station_id}/{station_name}/" ;
    dataCube:source [
        dataCube:column <dim-source/name-column>, <dim-source/id-column>
    ] ;
.

<dim-source/name-column> a dataCube:Column ; schema:name "station_name" .
<dim-source/id-column> a dataCube:Column ; schema:name "station_id" .

<attribute/station_id>
    a dataCube:Attribute, dataCube:ReferenceAttribute ;
    dataCube:table <fact-table> ;
    dataCube:referencedTable <dim-table> ;
    rdf:predicate schema:identifier ;
    dataCube:columnMapping [
        dataCube:sourceColumn <fact-source/name-column> ;
        dataCube:referencedColumn <dim-source/name-column> ;
    ], [
        dataCube:sourceColumn <fact-source/id-column> ;
        dataCube:referencedColumn <dim-source/id-column> ;
    ] ;
.`

export const unmappedColumnGraph = parseGraph(unmappedColumn)
export const mappedColumnGraph = parseGraph(mappedColumn)
export const multipleMappedColumnsGraph = parseGraph(multipleMappedColumns)
export const columnMappedWithDatatypeGraph = parseGraph(columnMappedWithDatatype)
export const columnMappedWithLanguageGraph = parseGraph(columnMappedWithLanguage)
export const referenceAttributeGraph = parseGraph(referenceAttribute)
