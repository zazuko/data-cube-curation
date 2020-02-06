import { namedNode } from '@rdfjs/data-model'
import { NamedNode } from 'rdf-js'
import { buildCsvw } from './csvwBuilder'
import { Column, DimensionTable, ValueAttribute, Table } from '@zazuko/rdfine-data-cube/Table'
import { csvw, dataCube, rdf, schema, xsd } from '../namespaces'
import * as specGraphs from './csvwBuilder.spec-graphs'

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
        propertyTemplate: schema('name').value,
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
        types: [
          dataCube.Table,
        ],
        source: {
          name: 'test.csv',
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
        propertyTemplate: schema('name').value,
        datatype: {
          id: xsd.date,
        },
        default: '03/08/1990',
      }
      const table: RecursivePartial<Table> = {
        id: namedNode('http://example.com/table/Observation'),
        columns: [],
        attributes: [attribute],
        types: [
          dataCube.Table,
        ],
        source: {
          name: 'test.csv',
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
        propertyTemplate: schema('name').value,
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
        types: [
          dataCube.Table,
        ],
        source: {
          name: 'test.csv',
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
            propertyTemplate: schema('name').value,
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
            types: [
              dataCube.Table,
            ],
            source: {
              name: 'test.csv',
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
    it('uses absolute identifierTemplate for aboutUrl', async () => {
      // given
      const table: RecursivePartial<DimensionTable> = {
        id: namedNode('http://reference-attribute.test/fact-table'),
        identifierTemplate: 'http://example.com/{foo}/{bar}',
        columns: [],
        attributes: [],
        types: [
          dataCube.DimensionTable,
        ],
        project: {
          baseUri: 'http://example.com/tst-project',
        },
        source: {
          name: 'test.csv',
        },
      }

      // when
      const csvwDataset = buildCsvw(table as any)

      // then
      expect(csvwDataset.tableSchema.aboutUrl).toEqual('http://example.com/{foo}/{bar}')
    })

    it('concatenates project base when identifier template is note absolute', async () => {
      // given
      const table: RecursivePartial<DimensionTable> = {
        id: namedNode('http://reference-attribute.test/fact-table'),
        identifierTemplate: 'table/{foo}/{bar}',
        columns: [],
        attributes: [],
        types: [
          dataCube.DimensionTable,
        ],
        project: {
          baseUri: 'http://example.com/tst-project/',
        },
        source: {
          name: 'test.csv',
        },
      }

      // when
      const csvwDataset = buildCsvw(table as any)

      // then
      expect(csvwDataset.tableSchema.aboutUrl).toEqual('http://example.com/tst-project/table/{foo}/{bar}')
    })

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
      const table: RecursivePartial<DimensionTable> = {
        id: namedNode('http://reference-attribute.test/fact-table'),
        identifierTemplate: 'table/{foo}/{bar}',
        columns: [column],
        attributes: [attribute],
        types: [
          dataCube.DimensionTable,
        ],
        project: {
          baseUri: 'http://example.com/tst-project/',
        },
        source: {
          name: 'test.csv',
        },
      }

      // when
      const csvwDataset = buildCsvw(table as any)

      // then
      expect(csvwDataset.tableSchema.columns[0].propertyUrl).toEqual('http://example.com/tst-project/property/{foo}/{bar}')
    })
  })
})
