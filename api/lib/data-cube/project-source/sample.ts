import { Request, Response } from 'express'
import { asyncMiddleware } from 'middleware-async'
import $rdf from 'rdf-ext'
import { Literal } from 'rdf-js'
import cf from 'clownface'
import { loadSampleRows } from '../../services/sourceSamples'
import { NotFoundError } from '../../error'
import { api, hydra, rdf } from '../../namespaces'
import env from '../../env'

function buildCollectionGraph (collectionId: string, currentPageUrl: string, nextPageUrl: string, rows: Literal[][]) {
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

export const getSampleRows = asyncMiddleware(async (req: Request, res: Response, next) => {
  const collectionId = req.resourceId
  const sourceId = req.resourcePath.replace('source-sample', 'source')
  const limit = Number.parseInt(req.query.limit) || 5
  const offset = Number.parseInt(req.query.offset) || 0

  const sampleData = await loadSampleRows(sourceId.replace(env.BASE_URI, ''), limit, offset)

  if (sampleData) {
    // TODO: remove once clownface #17 is fixed
    const sampleDataLiterals = sampleData.map(cells => cells.map(cell => $rdf.literal(cell)))

    const currentPageUrl = `${collectionId}?limit=${limit}&offset=${offset}`
    const nextPageUrl = `${collectionId}?limit=${limit}&offset=${offset + 5}`
    res.setLink(currentPageUrl, 'canonical')
    res.graph(buildCollectionGraph(collectionId, currentPageUrl, nextPageUrl, sampleDataLiterals).toStream())
  } else {
    next(new NotFoundError())
  }
})
