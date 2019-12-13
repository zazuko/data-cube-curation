import { DomainError, mutate } from '@tpluscode/fun-ddr'
import { Project } from './index'
import { ProjectEvents } from './events'

export const unselectFactTable = mutate<Project, never>((state, cmd, emitter) => {
  if (!state.factTableSource) {
    throw new DomainError(state['@id'], 'Cannot unselect fact table', 'The source id parameter was missing')
  }

  emitter.emit<ProjectEvents, 'FactTableUnselected'>('FactTableUnselected', {
    previousSourceId: state.factTableSource,
  })

  return {
    ...state,
    factTableSource: null,
  }
})
