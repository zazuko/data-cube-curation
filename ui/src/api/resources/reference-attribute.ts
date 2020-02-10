import { HydraResource } from 'alcaeus/types/Resources'
import { ResourceId, ReferenceColumnMapping, ReferenceAttribute } from '@/types'
import { Constructor, getOrThrow, findOperation } from '../common'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base implements ReferenceAttribute {
    isValue = false
    isReference = true

    get actions () {
      return {
        delete: findOperation(this, URI.OP_ATTRIBUTE_DELETE),
        edit: findOperation(this, URI.OP_ATTRIBUTE_EDIT),
      }
    }

    get property (): string {
      return getOrThrow<string>(this, URI.PROP_PREDICATE)
    }

    get referencedTableId (): ResourceId {
      const table = getOrThrow<HydraResource>(this, URI.PROP_REFERENCED_TABLE)
      return table.id
    }

    get columnMapping (): ReferenceColumnMapping[] {
      return this.getArray(URI.PROP_COLUMN_MAPPING)
    }

    get tableId (): ResourceId {
      const table = getOrThrow<HydraResource>(this, URI.PROP_TABLE)
      return table.id
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_REFERENCE_ATTRIBUTE)
}
