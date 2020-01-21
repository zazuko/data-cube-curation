import { ResourceIndexer } from '@tpluscode/rdfine'
import { literal } from '@rdfjs/data-model'
import * as Table from '../../read-model/Table/index'
import * as Csvw from './index'
import { csvw } from '../../namespaces'

export function valueAttributeToCsvwColumn (attribute: Table.ValueAttribute, csvwColumn: Csvw.Column & ResourceIndexer) {
  Object.entries(attribute.parameters)
    .forEach(([param, value]) => {
      csvwColumn[csvw(param).value] = literal(value)
    })

  if (attribute.language) {
    csvwColumn.language = attribute.language
  } else if (attribute.datatype) {
    csvwColumn.datatype = attribute.datatype
  }

  return csvwColumn
}
