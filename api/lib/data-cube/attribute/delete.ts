import { Request } from 'express'
import asyncMiddleware from 'middleware-async'
import { attributes } from '../../storage/repository'
import { NotFoundError } from '../../error'

export const handler = asyncMiddleware(async (req: Request, res, next) => {
  const attributeId = req.resourceId

  const attribute = await attributes.load(attributeId)
  if (await attribute.state === null) {
    throw new NotFoundError()
  }

  await attribute.delete()
    .commit(attributes)

  res.status(204)
  next()
})
