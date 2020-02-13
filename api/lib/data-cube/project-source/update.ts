import asyncMiddleware from 'middleware-async'
import { NextFunction, Request, Response } from 'express'
import { RdfResourceImpl } from '@tpluscode/rdfine'
import { CsvSourceMixin, SourceMixin } from '@zazuko/rdfine-data-cube/Source'
import { sources } from '../../storage/repository'
import { updateSource } from '../../domain/source/updateSource'
import { RequestError } from '../../error'

class UpdateModel extends CsvSourceMixin(SourceMixin(RdfResourceImpl)) {
  static get types () {
    return []
  }
}

export const handler = asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
  const ar = await sources.load(req.resourceId)

  const command = req.buildModel(UpdateModel, ['', req.resourceId])[0]

  if (!command) {
    throw new RequestError('Unrecognized request representation')
  }

  await ar.mutation(updateSource)(command).commit(sources)
  next()
})
