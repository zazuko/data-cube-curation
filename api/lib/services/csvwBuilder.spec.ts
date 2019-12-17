import * as specGraphs from './csvwBuilder.spec-graphs'
import { buildCsvw } from './csvwBuilder'
import { DimensionTable } from '../read-model/Table'
import { namedNode } from 'rdf-data-model'
import { dataCube } from '../namespaces'

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

const { ids } = specGraphs

describe('csvwBuilder', () => {
  it('includes unmapped source columns as suppressed', async () => {
    // given
    const dataset = await specGraphs.unmappedColumnGraph()

    // when
    const csvwDataset = buildCsvw(dataset, ids.tableId)

    // then
    expect(csvwDataset.dataset.toCanonical()).toMatchSnapshot()
  })

  it('maps attribute', async () => {
    // given
    const dataset = await specGraphs.mappedColumnGraph()

    // when
    const csvwDataset = buildCsvw(dataset, ids.tableId)

    // then
    expect(csvwDataset.dataset.toCanonical()).toMatchSnapshot()
  })

  it('maps multiple attributes mapping same column', async () => {
    // given
    const dataset = await specGraphs.multipleMappedColumnsGraph()

    // when
    const csvwDataset = buildCsvw(dataset, ids.tableId)

    // then
    expect(csvwDataset.dataset.toCanonical()).toMatchSnapshot()
  })

  it('maps attribute with datatype', async () => {
    // given
    const dataset = await specGraphs.columnMappedWithDatatypeGraph()

    // when
    const csvwDataset = buildCsvw(dataset, ids.tableId)

    // then
    expect(csvwDataset.dataset.toCanonical()).toMatchSnapshot()
  })

  it('maps attribute with language tag', async () => {
    // given
    const dataset = await specGraphs.columnMappedWithLanguageGraph()

    // when
    const csvwDataset = buildCsvw(dataset, ids.tableId)

    // then
    expect(csvwDataset.dataset.toCanonical()).toMatchSnapshot()
  })

  it('maps reference attribute', async () => {
    // given
    const dataset = await specGraphs.referenceAttributeGraph()

    // when
    const csvwDataset = buildCsvw(dataset, `http://reference-attribute.test/fact-table`)

    // then
    expect(csvwDataset.dataset.toCanonical()).toMatchSnapshot()
  })

  describe('mapping for DimensionTable', () => {
    it('uses identifierTemplate for aboutUrl', async () => {
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
      const csvwDataset = buildCsvw(table)

      // then
      expect(csvwDataset.tableSchema.aboutUrl).toEqual('http://example.com/{foo}/{bar}')
    })
  })
})
