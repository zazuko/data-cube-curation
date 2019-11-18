import { HydraResource } from 'alcaeus/types/Resources'
import { ResourceId } from '@/types'
import { Constructor, getOrThrow, findOperation } from '../common'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base {
    get actions () {
      return {
        delete: findOperation(this, URI.OP_ATTRIBUTE_DELETE),
        edit: findOperation(this, URI.OP_ATTRIBUTE_EDIT)
      }
    }

    get name () {
      return this.get(URI.PROP_NAME)
    }

    get columnId (): ResourceId {
      const column = getOrThrow<HydraResource>(this, URI.PROP_COLUMN)
      return column.id
    }

    get predicateId () {
      const predicate = getOrThrow<HydraResource>(this, URI.PROP_PREDICATE)
      return predicate.id
    }

    get type () {
      return this.get(URI.PROP_TYPE)
    }

    get language () {
      return this.get(URI.PROP_LANGUAGE)
    }

    get tableId () {
      const table = getOrThrow<HydraResource>(this, URI.PROP_TABLE)
      return table.id
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_ATTRIBUTE)
}
