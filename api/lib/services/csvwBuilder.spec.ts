import * as specGraphs from './csvwBuilder.spec-graphs'
import { buildCsvw } from './csvwBuilder'

const { ids } = specGraphs

describe('csvwBuilder', () => {
  it('includes unmapped source columns as suppressed', async () => {
    // given
    const dataset = await specGraphs.unmappedColumnGraph()

    // when
    const csvwDataset = buildCsvw(dataset, ids.tableId)

    // then
    expect(csvwDataset.toCanonical()).toMatchSnapshot()
  })

  it('maps attribute', async () => {
    // given
    const dataset = await specGraphs.mappedColumnGraph()

    // when
    const csvwDataset = buildCsvw(dataset, ids.tableId)

    // then
    expect(csvwDataset.toCanonical()).toMatchSnapshot()
  })

  it('maps multiple attributes mapping same column', async () => {
    // given
    const dataset = await specGraphs.multipleMappedColumnsGraph()

    // when
    const csvwDataset = buildCsvw(dataset, ids.tableId)

    // then
    expect(csvwDataset.toCanonical()).toMatchSnapshot()
  })

  it('maps attribute with datatype', async () => {
    // given
    const dataset = await specGraphs.columnMappedWithDatatypeGraph()

    // when
    const csvwDataset = buildCsvw(dataset, ids.tableId)

    // then
    expect(csvwDataset.toCanonical()).toMatchSnapshot()
  })

  it('maps attribute with language tag', async () => {
    // given
    const dataset = await specGraphs.columnMappedWithLanguageGraph()

    // when
    const csvwDataset = buildCsvw(dataset, ids.tableId)

    // then
    expect(csvwDataset.toCanonical()).toMatchSnapshot()
  })

  it('maps reference attribute', async () => {
    // given
    const dataset = await specGraphs.referenceAttributeGraph()

    // when
    const csvwDataset = buildCsvw(dataset, `http://reference-attribute.test/fact-table`)

    // then
    expect(csvwDataset.toCanonical()).toMatchSnapshot()
  })
})
