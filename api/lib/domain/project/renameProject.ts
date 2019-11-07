import { mutate } from '@tpluscode/fun-ddr'
import { ProjectEvents } from './events'
import { Project } from './index'

interface RenameCommand {
  newName: string;
}

export const renameProject = mutate<Project, RenameCommand>(function (state, renameCommand, emitter) {
  if (state.name !== renameCommand.newName) {
    emitter.emit<ProjectEvents, 'ProjectRenamed'>('ProjectRenamed', {
      name: renameCommand.newName,
    })
  }

  return {
    ...state,
    name: renameCommand.newName,
  }
})
