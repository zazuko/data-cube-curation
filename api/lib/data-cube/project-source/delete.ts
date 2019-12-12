import { sources } from '../../storage/repository'
import { deleteAggregateHandler } from '../handlers'
import { AggregateRoot } from '@tpluscode/fun-ddr/lib'
import { Source } from '../../domain/source'
import { isReferenced } from '../../read-graphs/source/isReferenced'
import { DomainError } from '@tpluscode/fun-ddr'

export const handler = deleteAggregateHandler({
  repository: sources,
  async beforeDelete (source: AggregateRoot<Source>) {
    const sourceId = (await source.state)['@id']
    if (await isReferenced(sourceId)) {
      throw new DomainError(sourceId, 'Cannot delete source', 'It is being used')
    }

    return source
  },
})
