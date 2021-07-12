import express from 'express'
import asyncMiddleware from 'middleware-async'
import $rdf from 'rdf-ext'
import { getTableAndSource } from '../../read-graphs/table/csvw'
import CsvwParser from 'rdf-parser-csvw'
import { loadSourceSample, dialect } from '../../services/sourceSamples'
import { getTableSourceId } from '../../read-graphs/table'
import { buildCsvw } from '../../services/csvwBuilder'
import { NotFoundError } from '../../error'
import { getTableId } from '../../read-graphs/table/links'

export const parseSample = asyncMiddleware(async (req: express.Request, res: express.Response, next) => {
  const tableId = await getTableId(req.resourceId)
  if (!tableId) {
    throw new NotFoundError()
  }

  const sourceId = await getTableSourceId(tableId)
  if (!sourceId) {
    throw new NotFoundError()
  }

  const dataset = await getTableAndSource(tableId)
  const csvwMetadata = buildCsvw({ dataset, tableId })
  const sampleCsv = await loadSourceSample(sourceId)
  csvwMetadata.setDialect(dialect)

  if (!sampleCsv) {
    next(new NotFoundError('Could not find sample csv'))
    return
  }

  const parser = new CsvwParser({
    metadata: csvwMetadata.pointer.dataset,
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
})
