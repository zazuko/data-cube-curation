import { NextFunction, Request, Response } from 'express'
import { Constructor, RdfResourceImpl } from '@tpluscode/rdfine'
import { NamedNode } from 'rdf-js'
import cf from 'clownface'
import env from './env'
import { rdf } from './namespaces'

export function resourceId (req: Request, res: Response, next: NextFunction) {
  req.resourcePath = req.path.substring(1)
  req.resourceId = `${env.BASE_URI}${req.resourcePath}`
  next()
}

export function modelBuilder (req: Request, res, next: NextFunction) {
  req.buildModel = function <T extends RdfResourceImpl> (Class: Constructor<T> & { types: NamedNode[] }) {
    return cf({ dataset: req.graph })
      .has(rdf.type, Class.types)
      .map(node => {
        return new Class(node)
      })
  }

  next()
}
