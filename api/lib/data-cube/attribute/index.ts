import express from 'express'
import { asyncMiddleware } from 'middleware-async'
import { getSingleAttribute } from '../../read-graphs/attribute'

export const getHandler = asyncMiddleware(async (req, res: express.DataCubeResponse, next) => {
  const attributeId = `${process.env.BASE_URI}${req.path.substring(1)}`
  getSingleAttribute(attributeId)
    .then(dataset => {
      if (dataset === null) {
        res.status(404)
        next()
      }

      res.graph(dataset)
    })
    .catch(next)
})
