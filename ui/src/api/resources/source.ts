import { HydraResource, Collection } from 'alcaeus/types/Resources'
import { ResourceId, Source, Column } from '@/types'
import { Constructor, findOperation, getOrThrow } from '../common'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base implements Source {
    get actions () {
      return {
        delete: findOperation(this, URI.OP_SOURCE_DELETE),
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

    get projectId (): ResourceId {
      const project = getOrThrow<HydraResource>(this, URI.PROP_PROJECT)
      return project.id
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_SOURCE)
}
