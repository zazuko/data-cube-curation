import { getSource } from './getSource'
import { getSourceColumns } from './getSourceColumns'

export async function getRepresentation (sourceId: string) {
  const dataset = await getSource(sourceId)

  await dataset.import((await getSourceColumns(sourceId)).toStream())

  return dataset
}
