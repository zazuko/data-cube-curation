import { Request, Response } from 'express'
import asyncMiddleware from 'middleware-async'
import { getSource } from '../../read-graphs/source/getSource'
import { getSourceColumns } from '../../read-graphs/source/getSourceColumns'
import $rdf = require('rdf-ext')

export const get = asyncMiddleware(async (req: Request, res: Response) => {
  const dataset = $rdf.dataset()

  await dataset.import(await getSource(req.resourceId))

  await dataset.import(await getSourceColumns(req.resourceId))

  res.graph(dataset.toStream())
})
