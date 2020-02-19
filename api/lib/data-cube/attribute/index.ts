import { Request, Response } from 'express'
import { asyncMiddleware } from 'middleware-async'
import { getSingleAttribute } from '../../read-graphs/attribute'

export const getHandler = asyncMiddleware(async (req: Request, res: Response, next) => {
  getSingleAttribute(req.resourceId)
    .then(dataset => {
      if (dataset === null) {
        res.status(404)
        next()
      } else {
        res.graph(dataset)
      }
    })
    .catch(next)
})
