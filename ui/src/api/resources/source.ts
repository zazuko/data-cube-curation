import { HydraResource, Collection } from 'alcaeus/types/Resources'
import { ResourceId } from '@/types'
import { Constructor, getOrThrow, findOperation } from '../common'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base {
    get actions () {
      return {
        delete: findOperation(this, URI.OP_SOURCE_DELETE)
      }
    }

    get name () {
      return this.get(URI.PROP_NAME)
    }

    get columns () {
      const collection = this.get<Collection>(URI.API_SOURCE_COLUMNS)

      return collection ? collection.members : []
    }

    get sampleCollection () {
      return this.get<Collection>(URI.API_SOURCE_SAMPLE)
    }

    get projectId (): ResourceId {
      const project = getOrThrow<HydraResource>(this, URI.PROP_PROJECT)
      return project.id
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_SOURCE)
}
