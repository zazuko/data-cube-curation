import { getSource } from './getSource'
import { getSourceColumns } from './getSourceColumns'
import $rdf = require('rdf-ext')

export async function getRepresentation (sourceId: string) {
  const dataset = $rdf.dataset()

  await dataset.import(await getSource(sourceId))

  await dataset.import((await getSourceColumns(sourceId)).toStream())

  return dataset
}
