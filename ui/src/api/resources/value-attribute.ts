import { HydraResource } from 'alcaeus/types/Resources'
import { DataType, DataTypeParam, DataTypeParamValues, ResourceId, ValueAttribute } from '@/types'
import * as datatypes from '@/datatypes'
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

    get dataType (): DataType | null {
      const dataType = this.get<HydraResource>(URI.PROP_DATATYPE)
      const language = this.get<string>(URI.PROP_LANGUAGE) ?? ''
      const defaultValue = this.get<string>(URI.PROP_DEFAULT) ?? ''

      if (!dataType && !language && !defaultValue) {
        return null
      }

      const commonParams: DataTypeParamValues = { language, default: defaultValue }

      const dataTypeParams = this.get<HydraResource>(URI.PROP_DATATYPE_PARAMS)
      const paramURIs: [ResourceId, DataTypeParam][] = [
        [URI.PROP_DATATYPE_PARAM_FORMAT, 'format']
      ]
      const params: DataTypeParamValues = paramURIs.reduce((params, [paramURI, paramProp]) => {
        const paramValue = dataTypeParams?.get<string>(paramURI)
        if (paramValue) {
          params[paramProp] = paramValue
        }
        return params
      }, commonParams)

      return {
        id: dataType?.id ?? datatypes.defaultURI,
        params: params
      }
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
