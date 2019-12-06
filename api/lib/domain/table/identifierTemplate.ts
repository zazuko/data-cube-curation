import { parse } from 'uri-template'
import cf from 'clownface'
import { NamedNode } from 'rdf-js'
import { getSourceColumns } from '../../read-graphs/source/getSourceColumns'
import { rdf, dataCube, schema } from '../../namespaces'

export async function extractColumnIds (sourceIdOrDataset: string | unknown, template: string): Promise<string[] | Error> {
  let columnNames: string[]
  try {
    columnNames = parse(template).expressions.map(ex => ex.params[0].name)
  } catch (e) {
    return e
  }

  const dataset = typeof sourceIdOrDataset === 'string'
    ? await getSourceColumns(sourceIdOrDataset)
    : sourceIdOrDataset

  const columnsNotFound: string[] = []
  const columns = cf({ dataset })
    .has(rdf.type, dataCube.Column)
  const columnIds = columnNames.map(name => {
    const columnNameTerm = columns.has(schema.name, name).term as NamedNode
    if (!columnNameTerm) {
      columnsNotFound.push(name)
      return
    }

    return columnNameTerm.value
  })

  if (columnsNotFound.length > 0) {
    return new Error(`Columns ${columnsNotFound.join(', ')} were not found in source`)
  }

  return columnIds
}
