import { Request, Response } from 'express'
import asyncMiddleware from 'middleware-async'
import { getSourceCollection } from '../../read-graphs/project/source-collection'

export const get = asyncMiddleware(async (req: Request, res: Response) => {
  const dataset = await getSourceCollection(req.resourceId)

  res.graph(dataset.toStream())
})
