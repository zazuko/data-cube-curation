import { mutate } from '@tpluscode/fun-ddr'
import { ProjectEvents } from './events'
import { Project } from './index'
import { errorFactory } from '../error-helper'
import { ensureSlash } from './baseUri'

interface UpdateCommand {
  name: string;
  baseUri: string;
  s3Bucket?: string;
  graphUri?: string;
}

export const updateProject = mutate<Project, UpdateCommand, ProjectEvents>(function (state, command, emitter) {
  const DomainError = errorFactory(state, 'Cannot update project')

  if (!command.name || typeof command.name !== 'string') {
    throw new DomainError('Invalid name')
  }

  if (!command.baseUri || typeof command.baseUri !== 'string') {
    throw new DomainError('Invalid base URI')
  }

  const baseUri = ensureSlash(command.baseUri)
  const s3Bucket = command.s3Bucket || ''
  const graphUri = command.graphUri || ''

  if (state.name !== command.name) {
    emitter.emit.ProjectRenamed({
      name: command.name,
    })
  }
  if (state.baseUri !== baseUri) {
    emitter.emit.ProjectRebased({
      baseUri,
    })
  }
  if (state.s3Bucket !== s3Bucket) {
    emitter.emit.S3BucketChanged({
      s3Bucket,
    })
  }
  if (state.graphUri !== graphUri) {
    emitter.emit.GraphUriChanged({
      graphUri,
    })
  }

  return {
    ...state,
    name: command.name,
    baseUri,
    s3Bucket,
    graphUri,
  }
})
