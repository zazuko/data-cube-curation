import * as Table from '../../read-model/Table/index'
import * as Csvw from './index'

export function valueAttributeToCsvwColumn (attribute: Table.ValueAttribute, csvwColumn: Csvw.Column) {
  if (attribute.language) {
    csvwColumn.language = attribute.language
  } else if (attribute.datatype) {
    csvwColumn.datatype = attribute.datatype
  }

  return csvwColumn
}
