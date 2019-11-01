import express from 'express'
import { getSingleAttribute } from '../../read-graphs/attribute'

export async function getHandler(req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
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
}
