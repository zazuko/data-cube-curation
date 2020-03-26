import { Constructor, property, RdfResource, RdfResourceImpl } from '@tpluscode/rdfine'
import { Initializer, ResourceNode } from '@tpluscode/rdfine/lib/RdfResource'
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

    @property.literal({ path: dataCube.graphUri })
    public graphUri?: string
  }

  return Project
}

ProjectMixin.shouldApply = (node: RdfResource) => {
  return node.hasType(dataCube.Project)
}
ProjectMixin.Class = class extends ProjectMixin(RdfResourceImpl) {
  constructor (node: ResourceNode, init?: Initializer<DataCube.Project>) {
    super(node, init)

    this.types.add(dataCube.Project)
  }
}
