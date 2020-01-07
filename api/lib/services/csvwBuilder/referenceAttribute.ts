import Clownface from 'clownface/lib/Clownface'
import { Literal, NamedNode } from 'rdf-js'
import parser from 'uri-template'
import { csvw, dataCube, schema } from '../../namespaces'
import { error, warning } from '../../log'

export function referenceAttributeToCsvwColumn (attribute: Clownface, csvwColumn: Clownface) {
  const referencedTable = attribute.out<NamedNode>(dataCube.referencedTable)

  const identifierTemplate = referencedTable.out<Literal>(dataCube.identifierTemplate)
  const columnNameMap = attribute.out<NamedNode>(dataCube.columnMapping).toArray()
    .reduce((map, mapping) => {
      const from = mapping.out(dataCube.sourceColumn).out(schema('name')).value
      const to = mapping.out(dataCube.referencedColumn).out(schema('name')).value

      if (to && from) {
        map.set(to, from)
      }

      return map
    }, new Map<string, string>())

  if (typeof identifierTemplate.value === 'string') {
    const uriTemplate = parser.parse(identifierTemplate.value)
    uriTemplate.expressions.forEach(expression => {
      expression.params.forEach(p => {
        // TODO: required until grncdr/uri-template#19 is fixed
        p.explode = ''
        if (columnNameMap.has(p.name)) {
          p.name = columnNameMap.get(p.name)
        } else {
          warning('Column name %s was not found in template for table <%s>', p.name, referencedTable.value)
        }
      })
    })

    csvwColumn.addOut(csvw.valueUrl, uriTemplate.toString())
  }

  error(`Failed to create column for reference attribute <%s>`, attribute.value)
  return csvwColumn
}
