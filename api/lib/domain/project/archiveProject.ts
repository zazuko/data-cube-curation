import { mutate } from '@tpluscode/fun-ddr'
import { ProjectEvents } from './events'
import { Project } from './index'

export const archiveProject = mutate<Project, never, ProjectEvents>(function (state, cmd, emitter) {
  if (state.archived === 'false') {
    emitter.emit.ProjectArchived(null)
  }

  return {
    ...state,
    archived: 'true',
  }
})
