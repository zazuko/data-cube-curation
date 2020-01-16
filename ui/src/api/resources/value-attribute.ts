import { HydraResource } from 'alcaeus/types/Resources'
import { ResourceId, ValueAttribute } from '@/types'
import { Constructor, getOrThrow, findOperation } from '../common'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base implements ValueAttribute {
    isValue = true
    isReference = false

    get actions () {
      return {
        delete: findOperation(this, URI.OP_ATTRIBUTE_DELETE),
        edit: findOperation(this, URI.OP_ATTRIBUTE_EDIT)
      }
    }

    get columnId (): ResourceId {
      const column = getOrThrow<HydraResource>(this, URI.PROP_COLUMN)
      return column.id
    }

    get property (): string {
      return getOrThrow<string>(this, URI.PROP_PREDICATE)
    }

    get dataTypeId (): ResourceId | null {
      const dataType = this.get<HydraResource>(URI.PROP_DATATYPE)
      return dataType ? dataType.id : null
    }

    get language (): string | null {
      return this.get(URI.PROP_LANGUAGE)
    }

    get tableId (): ResourceId {
      const table = getOrThrow<HydraResource>(this, URI.PROP_TABLE)
      return table.id
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_VALUE_ATTRIBUTE)
}
