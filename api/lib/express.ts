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
  req.buildModel = function <T extends RdfResourceImpl> (Class: Constructor<T> & { types: NamedNode[] }, ids?: (string | NamedNode)[]) {
    let graph = cf({ dataset: req.graph })
    if (ids) {
      graph = graph.namedNode(ids)
    }

    if (Class.types.some(Boolean)) {
      graph = graph
        .has(rdf.type, Class.types)
    }

    return graph
      .filter(node => node.out().terms.some(Boolean))
      .map(node => {
        return new Class(node)
      })
  }

  next()
}
