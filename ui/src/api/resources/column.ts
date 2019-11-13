import { HydraResource, Collection } from 'alcaeus/types/Resources'
import { Constructor, findOperation } from '../common'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base {
    get actions () {
      return {}
    }

    get name () {
      return this.get(URI.PROP_NAME)
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_COLUMN)
}
