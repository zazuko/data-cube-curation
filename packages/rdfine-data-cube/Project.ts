import { Constructor, property, RdfResource } from '@tpluscode/rdfine'
import { api, dataCube, schema } from './namespaces'
import * as DataCube from '.'

export function ProjectMixin<TBase extends Constructor> (Base: TBase) {
  class Project extends Base implements DataCube.Project {
    @property.literal({ path: schema.name })
    public name!: string

    @property.literal({ path: dataCube.baseUri })
    public baseUri!: string

    @property.resource({ path: api.tables })
    public tables!: RdfResource

    @property.literal({ path: api.s3Bucket })
    public s3Bucket?: string
  }

  return Project
}

ProjectMixin.shouldApply = (node: RdfResource) => {
  return node.hasType(dataCube.Project)
}
