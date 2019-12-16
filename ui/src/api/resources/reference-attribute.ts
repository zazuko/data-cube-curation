import { HydraResource } from 'alcaeus/types/Resources'
import { ResourceId } from '@/types'
import { Constructor, getOrThrow, findOperation } from '../common'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base {
    isValue = false
    isReference = true

    get actions () {
      return {
        delete: findOperation(this, URI.OP_ATTRIBUTE_DELETE),
        edit: findOperation(this, URI.OP_ATTRIBUTE_EDIT)
      }
    }

    get predicateId () {
      const predicate = getOrThrow<HydraResource>(this, URI.PROP_PREDICATE)
      return predicate.id
    }

    get referencedTableId () {
      const table = getOrThrow<HydraResource>(this, URI.PROP_REFERENCED_TABLE)
      return table.id
    }

    get columnMapping () {
      return this.getArray(URI.PROP_COLUMN_MAPPING)
    }

    get tableId () {
      const table = getOrThrow<HydraResource>(this, URI.PROP_TABLE)
      return table.id
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_REFERENCE_ATTRIBUTE)
}
