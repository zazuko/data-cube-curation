import { mutate } from '@tpluscode/fun-ddr'
import { ProjectEvents } from './events'
import { Project } from './index'
import { errorFactory } from '../error-helper'

interface UpdateCommand {
  newName: string;
  baseUri: string;
}

export const updateProject = mutate<Project, UpdateCommand>(function (state, command, emitter) {
  const DomainError = errorFactory(state, 'Cannot update project')

  if (!command.newName || typeof command.newName !== 'string') {
    throw new DomainError('Invalid name')
  }

  if (!command.baseUri || typeof command.baseUri !== 'string') {
    throw new DomainError('Invalid base URI')
  }

  if (state.name !== command.newName) {
    emitter.emit<ProjectEvents, 'ProjectRenamed'>('ProjectRenamed', {
      name: command.newName,
    })
  }
  if (state.baseUri !== command.baseUri) {
    emitter.emit<ProjectEvents, 'ProjectRebased'>('ProjectRebased', {
      baseUri: command.baseUri,
    })
  }

  return {
    ...state,
    name: command.newName,
    baseUri: command.baseUri,
  }
})
