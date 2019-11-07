import uuid from 'uuid'
import { DomainError, initialize } from '@tpluscode/fun-ddr'
import { ProjectEvents } from './events'
import { Project } from './index'

interface CreateCommand {
  uriSlug?: string;
  name: string;
}

export const createProject = initialize<Project, CreateCommand>(function (createCommand, emitter) {
  if (!createCommand.name || typeof createCommand.name !== 'string') {
    throw new DomainError(null, 'Cannot create Project', 'Invalid name')
  }

  emitter.emit<ProjectEvents, 'ProjectCreated'>('ProjectCreated', {
    name: createCommand.name,
  })

  return {
    '@id': `/project/${createCommand.uriSlug || uuid()}`,
    '@type': 'Project',
    name: createCommand.name,
    archived: 'false',
  }
})
