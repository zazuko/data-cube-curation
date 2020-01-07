import { parse } from 'uri-template'
import cf from 'clownface'
import { Dataset, NamedNode } from 'rdf-js'
import { getSourceColumns } from '../../read-graphs/source/getSourceColumns'
import { rdf, dataCube, schema } from '../../namespaces'

interface IdentifierColumn {
  id: string;
  name: string;
}

export async function extractColumns (sourceIdOrDataset: string | Dataset, template: string | null): Promise<IdentifierColumn[] | Error> {
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
      }]
  }, [] as IdentifierColumn[])

  if (columnsNotFound.length > 0) {
    return new Error(`Columns ${columnsNotFound.join(', ')} were not found in source`)
  }

  return columnIds
}
