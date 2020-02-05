import * as Csvw from '@rdfine/csvw'
import { error, warning } from '../../log'
import * as Table from '@zazuko/rdfine-data-cube/Table'
import { getAbsoluteUrl } from './aboutUrl'
import { parse } from '../uriTemplateParser'

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
    const uriTemplate = parse(referencedTable.identifierTemplate)
    columnNameMap.forEach((to, from) => {
      if (!uriTemplate.renameColumnVariable(from, to)) {
        warning('Column name %s was not found in template for table <%s>', to, referencedTable.id)
      }
    })

    csvwColumn.valueUrl = getAbsoluteUrl(referencedTable.project, uriTemplate)
  }

  error(`Failed to create column for reference attribute <%s>`, attribute.id)
  return csvwColumn
}
