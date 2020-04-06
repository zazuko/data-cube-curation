import RdfResourceImpl, { property } from '@tpluscode/rdfine'
import { dataCube } from '../../namespaces'
import { schema } from '@tpluscode/rdf-ns-builders'

export class UpdateTable extends RdfResourceImpl {
  @property.literal({ path: schema.name })
  name: string

  @property.literal({ path: dataCube.identifierTemplate })
  identifierTemplate: string
}
