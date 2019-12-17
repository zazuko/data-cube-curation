import { Constructor, factory } from './TypedEntityFactory'
import { literal } from './decorators'
import { dataCube, schema } from '../namespaces'
import TypedClownfaceEntity from './TypedClownfaceEntity'
import * as DataCube from '.'

export function ProjectMixin<TBase extends Constructor> (Base: TBase) {
  class Project extends Base implements DataCube.Project {
    @literal({ path: schema.name })
    public name: string

    @literal({ path: dataCube.baseUri })
    public baseUri: string
  }

  return Project
}

ProjectMixin.shouldApply = (node: TypedClownfaceEntity) => {
  return node.hasType(dataCube.Project)
}

factory.addMixin(ProjectMixin)
