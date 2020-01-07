
import { HydraResource, Collection } from 'alcaeus/types/Resources'
import { findOperation, Constructor, getOrThrow } from '../common'
import { Project } from '@/types'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base implements Project {
    get actions () {
      return {
        delete: findOperation(this, URI.OP_PROJECT_DELETE),
        edit: findOperation(this, URI.OP_PROJECT_EDIT),
        createSource: this.sourcesCollection && findOperation(this.sourcesCollection, URI.OP_SOURCES_CREATE),
        createDimensionTable: this.tablesCollection && findOperation(this.tablesCollection, URI.OP_TABLES_CREATE_DIMENSION),
        createFactTable: this.tablesCollection && findOperation(this.tablesCollection, URI.OP_TABLES_CREATE_FACT)
      }
    }

    get name (): string {
      return getOrThrow(this, URI.PROP_NAME)
    }

    get baseUri (): string {
      return this.get(URI.PROP_BASE_URI) || ''
    }

    get sourcesCollection (): Collection | null {
      return this.get<Collection>(URI.API_SOURCES)
    }

    get tablesCollection (): Collection | null {
      return this.get<Collection>(URI.API_TABLES)
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_PROJECT)
}
