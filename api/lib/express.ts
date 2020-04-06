import { NextFunction, Request, Response } from 'express'
import RdfResourceImpl, { Constructor, RdfResource } from '@tpluscode/rdfine'
import { rdf } from '@tpluscode/rdf-ns-builders'
import { Mixin } from '@tpluscode/rdfine/lib/ResourceFactory'
import { NamedNode } from 'rdf-js'
import { namedNode } from '@rdfjs/data-model'
import cf, { Clownface } from 'clownface'
import env from './env'

export function resourceId (req: Request, res: Response, next: NextFunction) {
  req.resourcePath = req.path.substring(1)
  req.resourceId = `${env.BASE_URI}${req.resourcePath}`
  req.resourceNode = namedNode(req.resourceId)
  next()
}

type ConstructorShape<T extends RdfResource> = Constructor<T> & { types?: NamedNode[] }
type MixinShape = Mixin<any>[]
type BuildModelShape<T extends RdfResource> = ConstructorShape<T> | MixinShape

export function modelBuilder (req: Request, res, next: NextFunction) {
  const defaultResourceIds = ['', req.resourceId]
  req.buildModel = function <T extends RdfResource> (modelShape: BuildModelShape<T>, ids: (string | NamedNode)[] = defaultResourceIds) {
    let graph: Clownface = cf({ dataset: req.graph }).namedNode(ids)
    let Class: Constructor

    if (graph.out().terms.length === 0) {
      // try to select the sole subject if there is only one
      const allSubjects = cf({ dataset: req.graph }).in()
      const subjectMap = new Map<string, Clownface>(allSubjects.map(node => [node.value, node]))
      if (subjectMap.size === 1) {
        graph = subjectMap.values().next().value
      }
    }

    if (Array.isArray(modelShape)) {
      Class = modelShape.reduce((mixed, mixin) => {
        return mixin(mixed)
      }, RdfResourceImpl)
    } else {
      if (modelShape.types && modelShape.types.some(Boolean)) {
        const allSubjects = cf({ dataset: req.graph }).in()
        graph = allSubjects
          .has(rdf.type, modelShape.types)
      }

      Class = modelShape
    }

    return graph
      .filter(node => node && node.out().terms.some(Boolean))
      .map(node => {
        return new Class(node)
      })
  }

  next()
}

export function representation (req: Request, res: Response, next: NextFunction) {
  res.representation = function (resource: RdfResource) {
    res.graph(resource._selfGraph.dataset)
  }

  next()
}
