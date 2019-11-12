
import { HydraResource, Collection } from 'alcaeus/types/Resources'
import { RemoteData, Table } from '@/types'
import { findOperation, Constructor } from '../common'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base {
    tables: RemoteData<Table[]> = { isLoading: true, data: null, error: null }

    get actions () {
      return {
        delete: findOperation(this, URI.OP_PROJECT_DELETE),
        edit: findOperation(this, URI.OP_PROJECT_EDIT),
        createSource: this.sourcesCollection && findOperation(this.sourcesCollection, URI.OP_SOURCES_CREATE),
        getTables: this.tablesCollection && findOperation(this.tablesCollection, URI.OP_TABLES_GET),
        createDimensionTable: this.tablesCollection && findOperation(this.tablesCollection, URI.OP_TABLES_CREATE_DIMENSION),
        createFactTable: this.tablesCollection && findOperation(this.tablesCollection, URI.OP_TABLES_CREATE_FACT)
      }
    }

    get name () {
      return this.get(URI.PROP_NAME)
    }

    get sourcesCollection () {
      return this.get<Collection>(URI.API_SOURCES)
    }

    get sources () {
      if (!this.sourcesCollection) return []

      return this.sourcesCollection.members
    }

    get tablesCollection () {
      return this.get<Collection>(URI.API_TABLES)
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_PROJECT)
}
