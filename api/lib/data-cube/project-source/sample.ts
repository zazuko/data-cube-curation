import express from 'express'
import { asyncMiddleware } from 'middleware-async'
import $rdf from 'rdf-ext'
import cf from 'clownface'
import { loadSampleRows } from '../../services/sourceSamples'
import { getSourceIdFromRoute } from './index'
import { NotFoundError } from '../../error'
import { api, hydra, rdf } from '../../namespaces'

function buildCollectionGraph (collectionId: string, currentPageUrl: string, nextPageUrl: string, rows: string[][]) {
  const dataset = $rdf.dataset()
  const collection = cf({ dataset }).node($rdf.namedNode(collectionId))

  collection.addOut(rdf.type, hydra.Collection)

  rows.forEach(row => {
    collection.addOut(hydra.member, member => {
      member.addList(api.cells, row)
    })
  })

  collection.addOut(hydra.view, $rdf.namedNode(currentPageUrl), view => {
    view.addOut(rdf.type, hydra.PartialCollectionView)
    view.addOut(hydra.next, $rdf.namedNode(nextPageUrl))
  })

  return dataset
}

export const getSampleRows = asyncMiddleware(async (req: express.DataCubeRequest, res: express.DataCubeResponse, next) => {
  const { sourceId } = getSourceIdFromRoute(req)
  const collectionId = sourceId.replace('/source/', '/source-sample/')
  const limit = Number.parseInt(req.query.limit) || 5
  const offset = Number.parseInt(req.query.offset) || 0

  const sampleData = await loadSampleRows(sourceId.replace(process.env.BASE_URI, ''), limit, offset)

  // TODO: remove once clownface #17 is fixed
  const sampleDataLiterals = sampleData.map(cells => cells.map($rdf.literal)) as any

  if (sampleData) {
    const currentPageUrl = `${collectionId}?limit=${limit}&offset=${offset}`
    const nextPageUrl = `${collectionId}?limit=${limit}&offset=${offset + 5}`
    res.setLink(currentPageUrl, 'canonical')
    res.graph(buildCollectionGraph(collectionId, currentPageUrl, nextPageUrl, sampleDataLiterals).toStream())
  } else {
    next(new NotFoundError())
  }
})
