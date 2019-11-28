import { HydraResource, Collection } from 'alcaeus/types/Resources'
import { Source } from '@/types'
import { Constructor, findOperation } from '../common'
import { getColor } from '../../colors'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base {
    attributes = [];
    color: string;

    constructor (...args: any[]) {
      super(...args)

      this.color = getColor(this.id)
    }

    get actions () {
      return {
        delete: findOperation(this, URI.TYPE_OP_DELETE),
        edit: findOperation(this, URI.OP_TABLE_EDIT),
        createAttribute: this.attributesCollection && findOperation(this.attributesCollection, URI.OP_ATTRIBUTES_CREATE)
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

    get sourceId () {
      const source = this.get<Source>(URI.PROP_SOURCE)
      return source ? source.id : null
    }

    get attributesCollection () {
      return this.get<Collection>(URI.API_ATTRIBUTES)
    }

    get preview () {
      return this.get(URI.API_PREVIEW)
    }

    get mapping () {
      return this.get(URI.API_CSVW)
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_TABLE)
}
