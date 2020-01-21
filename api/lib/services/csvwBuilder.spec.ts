import { buildCsvw } from './csvwBuilder'
import { Column, DimensionTable, ValueAttribute } from '../read-model/Table'
import { namedNode } from '@rdfjs/data-model'
import { dataCube, xsd } from '../namespaces'
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
      expect(csvwDataset._node.dataset.toCanonical()).toMatchSnapshot()
    })

    it('maps attribute', async () => {
      // given
      const dataset = await specGraphs.mappedColumnGraph()

      // when
      const csvwDataset = buildCsvw({ dataset, tableId: ids.tableId })

      // then
      expect(csvwDataset._node.dataset.toCanonical()).toMatchSnapshot()
    })

    it('maps multiple attributes mapping same column', async () => {
      // given
      const dataset = await specGraphs.multipleMappedColumnsGraph()

      // when
      const csvwDataset = buildCsvw({ dataset, tableId: ids.tableId })

      // then
      expect(csvwDataset._node.dataset.toCanonical()).toMatchSnapshot()
    })

    it('maps attribute with datatype', async () => {
      // given
      const dataset = await specGraphs.columnMappedWithDatatypeGraph()

      // when
      const csvwDataset = buildCsvw({ dataset, tableId: ids.tableId })

      // then
      expect(csvwDataset._node.dataset.toCanonical()).toMatchSnapshot()
    })

    it('maps attribute with datatype parameters', async () => {
      // given
      const dataset = await specGraphs.columnMappedWithDatatypeAndParamsGraph()

      // when
      const csvwDataset = buildCsvw({ dataset, tableId: ids.tableId })

      // then
      expect(csvwDataset._node.dataset.toCanonical()).toMatchSnapshot()
    })

    it('maps attribute with language tag', async () => {
      // given
      const dataset = await specGraphs.columnMappedWithLanguageGraph()

      // when
      const csvwDataset = buildCsvw({ dataset, tableId: ids.tableId })

      // then
      expect(csvwDataset._node.dataset.toCanonical()).toMatchSnapshot()
    })

    it('maps reference attribute', async () => {
      // given
      const dataset = await specGraphs.referenceAttributeGraph()

      // when
      const csvwDataset = buildCsvw({ dataset, tableId: `http://reference-attribute.test/fact-table` })

      // then
      expect(csvwDataset._node.dataset.toCanonical()).toMatchSnapshot()
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
      }

      // when
      const csvwDataset = buildCsvw(table as any)

      // then
      expect(csvwDataset.tableSchema.columns[0].propertyUrl).toEqual('http://example.com/tst-project/property/{foo}/{bar}')
    })

    it('uses concrete rdf:property if template is missing', async () => {
      // given
      const column: Partial<Column> = {
        id: namedNode('http://reference-attribute.test/column'),
        name: 'column',
      }
      const attribute: RecursivePartial<ValueAttribute> = {
        id: namedNode('http://reference-attribute.test/attribute'),
        column,
        datatype: { id: xsd.string },
        propertyTemplate: '',
        predicate: 'http://example.com/prop',
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
      }

      // when
      const csvwDataset = buildCsvw(table as any)

      // then
      expect(csvwDataset.tableSchema.columns[0].propertyUrl).toEqual('http://example.com/prop')
    })
  })
})
