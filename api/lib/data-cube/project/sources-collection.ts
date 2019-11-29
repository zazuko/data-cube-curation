import { Request, Response } from 'express'
import asyncMiddleware from 'middleware-async'
import { getSourceCollection } from '../../read-graphs/project/source-collection'

export const get = asyncMiddleware(async (req: Request, res: Response) => {
  const projectId = req.resourceId.replace(/\/sources$/, '')
  const dataset = await getSourceCollection(projectId)

  res.graph(dataset.toStream())
})
