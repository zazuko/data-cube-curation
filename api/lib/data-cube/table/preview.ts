import express from 'express'
import $rdf from 'rdf-ext'
import { getTableId } from './index'
import { getTableAndSource } from '../../read-graphs/table/csvw'
import CsvwParser from 'rdf-parser-csvw'
import { loadSourceSample } from '../../services/sourceSamples'
import { getTableSourceId } from '../../read-graphs/table'
import { buildCsvw } from '../../services/csvwBuilder'

export async function parseSample (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  try {
    const tableId = getTableId(req)
    const sourceId = await getTableSourceId(tableId)
    const tableDataset = await getTableAndSource(tableId)
    const csvwMetadata = buildCsvw(tableDataset, tableId)
    const sampleCsv = loadSourceSample(sourceId)

    const parser = new CsvwParser({
      metadata: csvwMetadata,
      factory: $rdf,
    })

    const result = await $rdf.dataset().import(parser.import(sampleCsv))

    res.graph(result.filter(quad => {
      if (quad.predicate.value.startsWith('http://www.w3.org/ns/csvw#')) {
        return false
      }
      if (quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' && quad.object.value.startsWith('http://www.w3.org/ns/csvw#')) {
        return false
      }
      return true
    })
    )
  } catch (e) {
    next(e)
  }
}
