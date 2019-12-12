import { projects } from '../../storage/repository'
import { emitImmediate } from '@tpluscode/fun-ddr/lib/events'
import { ProjectEvents } from '../../domain/project/events'
import { archiveProject } from '../../domain/project'
import { deleteAggregateHandler } from '../handlers'

export const handler = deleteAggregateHandler({
  repository: projects,
  onGone: (projectId: string) => {
    emitImmediate<ProjectEvents, 'ProjectArchived'>(
      projectId,
      'ProjectArchived',
      null
    )
  },
  beforeDelete: (current) => {
    return current.mutation(archiveProject)(null as never)
  },
})
