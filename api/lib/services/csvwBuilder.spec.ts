import { namedNode } from '@rdfjs/data-model'
import { FactTableMixin } from '@zazuko/rdfine-data-cube/Table/Table'
import { RdfResourceImpl } from '@tpluscode/rdfine'
import $rdf from 'rdf-ext'
import TermSet from '@rdfjs/term-set'
import { NamedNode } from 'rdf-js'
import { schema, xsd, rdf, csvw, qb } from '@tpluscode/rdf-ns-builders'
import { buildCsvw } from './csvwBuilder'
import { Column, ValueAttribute, Table, CsvSource, wireUp } from '@zazuko/rdfine-data-cube'
import { dataCube } from '../namespaces'
import * as specGraphs from './csvwBuilder.spec-graphs'

wireUp(RdfResourceImpl.factory)

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

const { ids } = specGraphs

describe('csvwBuilder', () => {
  describe('mapping for FactTable', () => {
    it('includes unmapped source columns as suppressed', async () => {
      // given
      const dataset = await specGraphs.unmappedColumnGraph()

      // when
      const csvwDataset = buildCsvw({ dataset, tableId: ids.tableId })

      // then
      expect(csvwDataset._selfGraph.dataset.toCanonical()).toMatchSnapshot()
    })

    it('includes "qb:Observation" virtual column', () => {
      const graph = { dataset: $rdf.dataset(), term: namedNode('http://example.com/table/Observation') }
      const table = new FactTableMixin.Class(graph, {
        types: [
          dataCube.FactTable,
        ],
        source: {},
      })

      // when
      const csvwDataset = buildCsvw(table)

      // then
      const column = csvwDataset.tableSchema.columns[0]
      expect(column.virtual).toBe(true)
      expect(column.propertyUrl).toEqual(rdf.type.value)
      expect(column.valueUrl).toEqual(qb.Observation.value)
    })

    it('maps attribute', async () => {
      // given
      const dataset = await specGraphs.mappedColumnGraph()

      // when
      const csvwDataset = buildCsvw({ dataset, tableId: ids.tableId })

      // then
      expect(csvwDataset._selfGraph.dataset.toCanonical()).toMatchSnapshot()
    })

    it('maps multiple attributes mapping same column', async () => {
      // given
      const dataset = await specGraphs.multipleMappedColumnsGraph()

      // when
      const csvwDataset = buildCsvw({ dataset, tableId: ids.tableId })

      // then
      expect(csvwDataset._selfGraph.dataset.toCanonical()).toMatchSnapshot()
    })

    it('maps attribute with datatype', async () => {
      // given
      const dataset = await specGraphs.columnMappedWithDatatypeGraph()

      // when
      const csvwDataset = buildCsvw({ dataset, tableId: ids.tableId })

      // then
      expect(csvwDataset._selfGraph.dataset.toCanonical()).toMatchSnapshot()
    })

    it('maps attribute with datatype parameters', async () => {
      // given
      const column: Partial<Column> = {
        id: namedNode('http://example.com/column/station_name'),
        name: 'station_name',
      }

      const attribute: RecursivePartial<ValueAttribute> = {
        id: namedNode('http://example.com/attribute/station_name'),
        column,
        propertyTemplate: schema.name.value,
        datatype: {
          id: xsd.TOKEN,
        },
        parameters: {
          format: 'dd/mm/yyyy',
        },
      }
      const table: RecursivePartial<Table> = {
        id: namedNode('http://example.com/table/Observation'),
        columns: [],
        attributes: [attribute],
        types: new TermSet([
          dataCube.Table,
        ]),
        source: {
          name: 'test.csv',
          quote: '"',
          delimiter: ';',
        } as CsvSource,
        createIdentifier: () => '',
        project: {
          baseUri: '',
        },
      }

      // when
      const csvwDataset = buildCsvw(table as any)

      // then
      expect(csvwDataset._selfGraph.dataset.toCanonical()).toMatchSnapshot()
    })

    it('maps attribute with default value', async () => {
      // given
      const column: Partial<Column> = {
        id: namedNode('http://example.com/column/station_name'),
        name: 'station_name',
      }

      const attribute: RecursivePartial<ValueAttribute> = {
        id: namedNode('http://example.com/attribute/station_name'),
        column,
        propertyTemplate: schema.name.value,
        datatype: {
          id: xsd.date,
        },
        default: '03/08/1990',
      }
      const table: RecursivePartial<Table> = {
        id: namedNode('http://example.com/table/Observation'),
        columns: [],
        attributes: [attribute],
        types: new TermSet([
          dataCube.Table,
        ]),
        source: {
          name: 'test.csv',
          quote: '"',
          delimiter: ';',
        } as CsvSource,
        createIdentifier: () => '',
        project: {
          baseUri: '',
        },
      }

      // when
      const csvwDataset = buildCsvw(table as any)

      // then
      expect(csvwDataset.tableSchema.columns[0].default).toEqual('03/08/1990')
      expect(csvwDataset._selfGraph.dataset.toCanonical()).toMatchSnapshot()
    })

    it('does not map as derived type when there are no parameters', async () => {
      // given
      const column: Partial<Column> = {
        id: namedNode('http://example.com/column/station_name'),
        name: 'station_name',
      }

      const attribute: RecursivePartial<ValueAttribute> = {
        id: namedNode('http://example.com/attribute/station_name'),
        column,
        propertyTemplate: schema.name.value,
        datatype: {
          id: xsd.double,
        },
        parameters: {
        },
      }
      const table: RecursivePartial<Table> = {
        id: namedNode('http://example.com/table/Observation'),
        columns: [],
        attributes: [attribute],
        types: new TermSet([
          dataCube.Table,
        ]),
        source: {
          name: 'test.csv',
          quote: '"',
          delimiter: ';',
        } as CsvSource,
        createIdentifier: () => '',
        project: {
          baseUri: '',
        },
      }

      // when
      const csvwDataset = buildCsvw(table as any)

      // then
      expect(csvwDataset._selfGraph.dataset.toCanonical()).toMatchSnapshot()
    })

    describe('maps specific datatypes to csvw built-in types', () => {
      const datatypeMappings: Array<[NamedNode, string]> = [
        [xsd.double, 'number'],
        [xsd.base64Binary, 'binary'],
        [xsd.dateTime, 'datetime'],
        [xsd.anyAtomicType, 'any'],
        [rdf.XMLLiteral, 'xml'],
        [rdf.HTML, 'html'],
        [csvw.JSON, 'json'],
      ]

      datatypeMappings.forEach(([datatype, builtInType]) => {
        it(`${datatype.value} => ${builtInType}`, () => {
          // given
          const column: Partial<Column> = {
            id: namedNode('http://example.com/column/station_name'),
            name: 'station_name',
          }

          const attribute: RecursivePartial<ValueAttribute> = {
            id: namedNode('http://example.com/attribute/station_name'),
            column,
            propertyTemplate: schema.name.value,
            datatype: {
              id: datatype,
            },
            parameters: {
              format: 'dd/mm/yyyy',
            },
          }
          const table: RecursivePartial<Table> = {
            id: namedNode('http://example.com/table/Observation'),
            columns: [],
            attributes: [attribute],
            types: new TermSet([
              dataCube.Table,
            ]),
            source: {
              name: 'test.csv',
            },
            createIdentifier: () => '',
            project: {
              baseUri: '',
            },
          }

          // when
          const csvwDataset = buildCsvw(table as any)

          // then
          expect(csvwDataset.tableSchema.columns[0].datatype[csvw.base.value].value).toEqual(builtInType)
        })
      })
    })

    it('maps attribute with language tag', async () => {
      // given
      const dataset = await specGraphs.columnMappedWithLanguageGraph()

      // when
      const csvwDataset = buildCsvw({ dataset, tableId: ids.tableId })

      // then
      expect(csvwDataset._selfGraph.dataset.toCanonical()).toMatchSnapshot()
    })

    it('maps reference attribute', async () => {
      // given
      const dataset = await specGraphs.referenceAttributeGraph()

      // when
      const csvwDataset = buildCsvw({ dataset, tableId: `http://reference-attribute.test/fact-table` })

      // then
      expect(csvwDataset._selfGraph.dataset.toCanonical()).toMatchSnapshot()
    })
  })

  describe('mapping for DimensionTable', () => {
    it('uses base URI for relative properties', async () => {
      // given
      const column: Partial<Column> = {
        id: namedNode('http://reference-attribute.test/column'),
        name: 'column',
      }
      const attribute: RecursivePartial<ValueAttribute> = {
        id: namedNode('http://reference-attribute.test/attribute'),
        column,
        datatype: { id: xsd.string },
        propertyTemplate: 'property/{foo}/{bar}',
      }
      const table: RecursivePartial<Table> = {
        id: namedNode('http://reference-attribute.test/fact-table'),
        identifierTemplate: 'table/{foo}/{bar}',
        columns: [column],
        attributes: [attribute],
        types: new TermSet([
          dataCube.DimensionTable,
        ]),
        project: {
          baseUri: 'http://example.com/tst-project/',
        },
        source: {
          name: 'test.csv',
        },
        createIdentifier: () => '',
      }

      // when
      const csvwDataset = buildCsvw(table as any)

      // then
      expect(csvwDataset.tableSchema.columns[0].propertyUrl).toEqual('http://example.com/tst-project/property/{foo}/{bar}')
    })
  })
})
