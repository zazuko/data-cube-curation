import { HydraResource, Collection } from 'alcaeus/types/Resources'
import { Constructor, findOperation, getOrThrow } from '../common'
import { Source, Column } from '@/types'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base implements Source {
    get actions () {
      return {
        delete: findOperation(this, URI.OP_SOURCE_DELETE)
      }
    }

    get name (): string {
      return getOrThrow(this, URI.PROP_NAME)
    }

    get columns (): Column[] {
      const collection = this.get<Collection>(URI.API_SOURCE_COLUMNS)

      return (collection ? collection.members : []) as Column[]
    }

    get sampleCollection (): Collection | null {
      return this.get<Collection>(URI.API_SOURCE_SAMPLE)
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_SOURCE)
}
