import { HydraResource, Collection } from 'alcaeus/types/Resources'
import { Source, Column, ResourceId, Table, TableFormData, TableType } from '@/types'
import { Constructor, findOperation, getOrThrow } from '../common'
import { getColor } from '../../colors'
import * as URI from '../uris'

export function Mixin<B extends Constructor> (Base: B) {
  return class extends Base implements Table {
    attributes = [];
    color: string;

    constructor (...args: any[]) {
      super(...args)

      this.color = getColor(this.id)
    }

    get actions () {
      return {
        delete: findOperation(this, URI.TYPE_OP_DELETE),
        edit: findOperation(this, URI.TYPE_OP_UPDATE),
        createValueAttribute: this.attributesCollection && findOperation(this.attributesCollection, URI.OP_ATTRIBUTES_CREATE_VALUE),
        createReferenceAttribute: this.attributesCollection && findOperation(this.attributesCollection, URI.OP_ATTRIBUTES_CREATE_REFERENCE),
      }
    }

    get type (): TableType {
      return this.isFact ? 'fact' : 'dimension'
    }

    get name (): string {
      return getOrThrow(this, URI.PROP_NAME)
    }

    get identifierTemplate (): string | null {
      return this.get(URI.PROP_IDENTIFIER_TEMPLATE)
    }

    get identifierColumns (): Column[] {
      return this.getArray<Column>(URI.PROP_IDENTIFIER_COLUMN)
    }

    get isFact (): boolean {
      return this.types.includes(URI.TYPE_FACT_TABLE)
    }

    get sourceId (): ResourceId {
      return getOrThrow<Source>(this, URI.PROP_SOURCE).id
    }

    get attributesCollection (): Collection | null {
      return this.get<Collection>(URI.API_ATTRIBUTES)
    }

    get preview () {
      return this.get(URI.API_PREVIEW)
    }

    get mapping () {
      return this.get(URI.API_CSVW)
    }

    getData (changes: { [K in keyof TableFormData]?: any }): TableFormData {
      return {
        id: this.id,
        type: this.type,
        name: this.name,
        color: this.color,
        identifierTemplate: this.identifierTemplate,
        sourceId: this.sourceId,
        ...changes,
      }
    }
  }
}

export function shouldApply (resource: HydraResource) {
  return resource.types.contains(URI.TYPE_TABLE)
}
