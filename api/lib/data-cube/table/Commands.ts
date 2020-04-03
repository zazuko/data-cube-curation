import RdfResourceImpl, { property } from '@tpluscode/rdfine'
import { dataCube, schema } from '../../namespaces'

export class UpdateTable extends RdfResourceImpl {
  @property.literal({ path: schema.name })
  name: string

  @property.literal({ path: dataCube.identifierTemplate })
  identifierTemplate: string
}
