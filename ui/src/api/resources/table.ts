import { HydraResource } from 'alcaeus/types/Resources'
import { Constructor, findOperation } from '../common'
import { getColor } from '../../colors'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base {
    attributes = [];

    constructor (...args: any[]) {
      super(...args)

      this.color = getColor(this.id)
    }

    get actions () {
      return {
        delete: findOperation(this, URI.OP_TABLE_DELETE),
        edit: findOperation(this, URI.OP_TABLE_EDIT)
      }
    }

    get name () {
      return this.get(URI.PROP_NAME)
    }

    get identifierTemplate () {
      return this.get(URI.PROP_IDENTIFIER_TEMPLATE)
    }

    get isFact () {
      return this.types.includes(URI.TYPE_FACT_TABLE)
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_TABLE)
}
