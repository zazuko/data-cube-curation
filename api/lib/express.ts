import { NextFunction, Request, Response } from 'express'
import { Constructor, RdfResourceImpl } from '@tpluscode/rdfine'
import { namedNode } from '@rdfjs/data-model'
import env from './env'

export function resourceId (req: Request, res: Response, next: NextFunction) {
  req.resourcePath = req.path.substring(1)
  req.resourceId = `${env.BASE_URI}${req.resourcePath}`
  next()
}

export function modelBuilder (req: Request, res, next: NextFunction) {
  req.buildModel = function <T extends RdfResourceImpl> (Class: Constructor<T>) {
    return new Class({
      dataset: req.graph,
      term: namedNode(''),
    })
  }

  next()
}
