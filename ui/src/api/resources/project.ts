
import { HydraResource, Collection } from 'alcaeus/types/Resources'
import { findOperation, Constructor } from '../common'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base {
    get actions () {
      return {
        delete: findOperation(this, URI.OP_PROJECT_DELETE),
        edit: findOperation(this, URI.OP_PROJECT_EDIT),
        createSource: this.sourcesCollection && findOperation(this.sourcesCollection, URI.OP_SOURCES_CREATE),
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

    get tablesCollection () {
      return this.get<Collection>(URI.API_TABLES)
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_PROJECT)
}
