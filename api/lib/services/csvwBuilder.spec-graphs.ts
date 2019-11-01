import stringToStream from 'string-to-stream'
import rdf from 'rdf-ext'
import Parser from '@rdfjs/parser-n3'
import { prefixes } from '@zazuko/rdf-vocabularies'

const parser = new Parser()
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
      a dataCube:Attribute, dataCube:ColumnAttribute ;
      dataCube:column <http://example.com/column/station_name> ;
      dataCube:table <${ids.tableId}> ;
      rdf:predicate <http://schema.org/name> .
`

const multipleMappedColumns = `${mappedColumn}

<http://example.com/attribute/station_name_with_lang>
      a dataCube:Attribute, dataCube:ColumnAttribute ;
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

function createGraph(ntriples: string) {
  return async () => {
    const dataset = rdf.dataset()
    const stream = stringToStream(`
  PREFIX dataCube: <${prefixes['dataCube']}>
  PREFIX xsd: <${prefixes.xsd}>
  PREFIX rdf: <${prefixes.rdf}>

  ${ntriples}`)
    return dataset.import(await parser.import(stream))
  }
}

export const unmappedColumnGraph = createGraph(unmappedColumn)
export const mappedColumnGraph = createGraph(mappedColumn)
export const multipleMappedColumnsGraph = createGraph(multipleMappedColumns)
export const columnMappedWithDatatypeGraph = createGraph(columnMappedWithDatatype)
export const columnMappedWithLanguageGraph = createGraph(columnMappedWithLanguage)
