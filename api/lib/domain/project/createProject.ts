import uuid from 'uuid'
import { initialize } from '@tpluscode/fun-ddr'
import { ProjectEvents } from './events'
import { Project } from './index'

interface CreateCommand {
  uriSlug?: string;
  name: string;
}

export const createProject = initialize<Project, CreateCommand>(function (createCommand, emitter) {
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
