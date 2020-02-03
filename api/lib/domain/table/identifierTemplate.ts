import cf from 'clownface'
import { NamedNode, DatasetCore } from 'rdf-js'
import { getSourceColumns } from '../../read-graphs/source/getSourceColumns'
import { rdf, dataCube, schema } from '../../namespaces'
import { parse } from '../../services/uriTemplateParser'

interface IdentifierColumn {
  id: string;
  name: string;
}

export async function extractColumns (sourceIdOrDataset: string | DatasetCore, template: string | null): Promise<IdentifierColumn[] | Error> {
  if (!template) {
    return new Error('Template cannot be empty')
  }

  let columnNames: string[]
  try {
    columnNames = parse(template).expressions.map(ex => ex.params[0].name).map(decodeURIComponent)
  } catch (e) {
    return e
  }

  const dataset = typeof sourceIdOrDataset === 'string'
    ? await getSourceColumns(sourceIdOrDataset)
    : sourceIdOrDataset

  const columnsNotFound: string[] = []
  const columns = cf({ dataset })
    .has(rdf.type, dataCube.Column)
  const columnIds = columnNames.reduce((identifiers, name) => {
    const columnNameTerm = columns.has(schema('name'), name).term as NamedNode
    if (!columnNameTerm) {
      columnsNotFound.push(name)
      return identifiers
    }

    return [
      ...identifiers,
      {
        id: columnNameTerm.value,
        name,
      },
    ]
  }, [] as IdentifierColumn[])

  if (columnsNotFound.length > 0) {
    return new Error(`Columns ${columnsNotFound.join(', ')} were not found in source`)
  }

  return columnIds
}
