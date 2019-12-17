import { HydraResource } from 'alcaeus/types/Resources'
import { Constructor, getOrThrow } from '../common'
import { Column } from '@/types'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base implements Column {
    get actions () {
      return {}
    }

    get name (): string {
      return getOrThrow(this, URI.PROP_NAME)
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_COLUMN)
}
