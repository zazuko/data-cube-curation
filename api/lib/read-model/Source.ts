import { property, Constructor } from '@tpluscode/rdfine'
import { schema } from '../namespaces'

export function SourceMixin<Base extends Constructor> (base: Base) {
  class Source extends base {
    @property.literal({ path: schema.name })
    public name!: string;
  }

  return Source
}
