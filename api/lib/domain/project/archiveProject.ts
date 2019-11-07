import { mutate } from '@tpluscode/fun-ddr'
import { ProjectEvents } from './events'
import { Project } from './index'

export const archiveProject = mutate<Project, never>(function (state, cmd, emitter) {
  if (state.archived === 'false') {
    emitter.emit<ProjectEvents, 'ProjectArchived'>('ProjectArchived', {})
  }

  return {
    ...state,
    archived: 'true',
  }
})
