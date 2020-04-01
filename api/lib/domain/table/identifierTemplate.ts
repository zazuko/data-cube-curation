import cf from 'clownface'
import { DatasetCore } from 'rdf-js'
import { rdf, schema } from '@tpluscode/rdf-ns-builders'
import { getSourceColumns } from '../../read-graphs/source/getSourceColumns'
import { dataCube } from '../../namespaces'
import { parse } from '@zazuko/rdfine-data-cube/lib/uriTemplateParser'

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
    columnNames = parse(template).columnNames
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
    const columnNameTerm = columns.has(schema.name, name).term
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
