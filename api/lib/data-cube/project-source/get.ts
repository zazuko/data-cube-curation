import { Request, Response } from 'express'
import asyncMiddleware from 'middleware-async'
import { getRepresentation } from '../../read-graphs/source/index'

export const get = asyncMiddleware(async (req: Request, res: Response) => {
  const dataset = await getRepresentation(req.resourceId)

  res.graph(dataset.toStream())
})
