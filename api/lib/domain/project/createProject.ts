import uuid from 'uuid'
import { DomainError, initialize } from '@tpluscode/fun-ddr'
import { ProjectEvents } from './events'
import { Project } from './index'
import { ensureSlash, temporaryUri } from './baseUri'

interface CreateCommand {
  uriSlug?: string;
  name: string;
  baseUri?: string;
}

export const createProject = initialize<Project, CreateCommand, ProjectEvents>(function (createCommand, emitter) {
  if (!createCommand.name || typeof createCommand.name !== 'string') {
    throw new DomainError('', 'Cannot create Project', 'Invalid name')
  }

  const baseUri = ensureSlash(createCommand.baseUri) || temporaryUri(createCommand.name)
  emitter.emit.ProjectCreated({
    name: createCommand.name,
    baseUri,
  })

  return {
    '@id': `/project/${createCommand.uriSlug || uuid()}`,
    '@type': 'Project',
    name: createCommand.name,
    archived: 'false',
    baseUri,
  }
})
