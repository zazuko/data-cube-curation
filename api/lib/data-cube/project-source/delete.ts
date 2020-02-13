import { sources } from '../../storage/repository'
import { deleteAggregateHandler } from '../handlers'
import { isReferenced } from '../../read-graphs/source/isReferenced'
import { DomainError } from '@tpluscode/fun-ddr'

export const handler = deleteAggregateHandler({
  repository: sources,
  async beforeDelete (source) {
    const state = await source.state
    if (state && await isReferenced(state['@id'])) {
      throw new DomainError(state['@id'], 'Cannot delete source', 'It is being used')
    }

    return source
  },
})
