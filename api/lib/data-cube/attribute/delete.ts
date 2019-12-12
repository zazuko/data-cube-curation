import { attributes } from '../../storage/repository'
import { deleteAggregateHandler } from '../handlers'

export const handler = deleteAggregateHandler({
  repository: attributes,
})
