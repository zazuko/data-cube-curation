import { mutate } from '@tpluscode/fun-ddr'
import { Project } from './index'
import { ProjectEvents } from './events'

export const unselectFactTable = mutate<Project, never>((state, cmd, emitter) => {
  emitter.emit<ProjectEvents, 'FactTableUnselected'>('FactTableUnselected', {
    previousSourceId: state.factTableSource,
  })

  return {
    ...state,
    factTableSource: null,
  }
})
