import asyncMiddleware from 'middleware-async'
import { NextFunction, Request, Response } from 'express'
import { RdfResourceImpl } from '@tpluscode/rdfine'
import { sources } from '../../storage/repository'
import { updateSource } from '../../domain/source/updateSource'
import { dataCube } from '../../namespaces'
import { CsvSourceMixin, SourceMixin } from '@zazuko/rdfine-data-cube/Source'

class UpdateModel extends CsvSourceMixin(SourceMixin(RdfResourceImpl)) {
  static get types () {
    return [dataCube.Source]
  }
}

export const handler = asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
  const ar = await sources.load(req.resourceId)

  const command = req.buildModel(UpdateModel, ['', req.resourceId])[0]

  await ar.mutation(updateSource)(command).commit(sources)
  next()
})
