import parser from 'uri-template'
import { error, warning } from '../../log'
import * as Table from '../../read-model/Table'
import * as Csvw from '../csvwBuilder/index'
import { getAbsoluteUrl } from './aboutUrl'

export function referenceAttributeToCsvwColumn (attribute: Table.ReferenceAttribute, csvwColumn: Csvw.Column) {
  const referencedTable = attribute.referencedTable

  const columnNameMap = attribute.columnMappings
    .reduce((map, mapping) => {
      const from = mapping.sourceColumn.name
      const to = mapping.referencedColumn.name

      map.set(to, from)

      return map
    }, new Map<string, string>())

  if (typeof referencedTable.identifierTemplate === 'string') {
    const uriTemplate = parser.parse(referencedTable.identifierTemplate)
    uriTemplate.expressions.forEach(expression => {
      expression.params.forEach(p => {
        if (columnNameMap.has(p.name)) {
          p.name = columnNameMap.get(p.name)
        } else {
          warning('Column name %s was not found in template for table <%s>', p.name, referencedTable.id)
        }
      })
    })

    csvwColumn.valueUrl = getAbsoluteUrl(referencedTable.project, uriTemplate)
  }

  error(`Failed to create column for reference attribute <%s>`, attribute.id)
  return csvwColumn
}
