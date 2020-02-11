import asyncMiddleware from 'middleware-async'
import { NextFunction, Request, Response } from 'express'
import { namespace, property, RdfResourceImpl } from '@tpluscode/rdfine'
import { sources } from '../../storage/repository'
import { UpdateCommand, updateSource } from '../../domain/source/updateSource'
import { dataCube, schema } from '../../namespaces'

@namespace(dataCube)
class UpdateModel extends RdfResourceImpl implements UpdateCommand {
  static get types () {
    return [dataCube.Source]
  }

  @property.literal({ path: schema.name })
  name?: string;

  @property.literal({ path: 'csvDelimiter' })
  delimiter?: string;

  @property.literal({ path: 'csvQuote' })
  quote?: string;
}

export const handler = asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
  const ar = await sources.load(req.resourceId)

  const command = req.buildModel(UpdateModel, ['', req.resourceId])[0]

  await ar.mutation(updateSource)(command).commit(sources)
  next()
})
