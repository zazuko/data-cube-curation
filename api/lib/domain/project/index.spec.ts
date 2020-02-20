import { updateProject } from './index'
import { DomainError } from '@tpluscode/fun-ddr'
import { DomainEventEmitter } from '@tpluscode/fun-ddr/lib'
import { fakeDomainEventEmitter } from '../../__tests-helpers__'

describe('Project', () => {
  const nullProject = {
    '@id': 'foo',
    '@type': 'Project',
    archived: 'false' as 'true' | 'false',
  }

  let emit: jest.Mock
  let emitter: DomainEventEmitter<any>
  beforeEach(() => {
    emit = jest.fn()
    emitter = fakeDomainEventEmitter(emit)
  })

  describe('rename command', () => {
    it('does not emit event when nothing changes', async () => {
      // given
      const project = {
        ...nullProject,
        name: 'a name',
        baseUri: 'urn:foo:',
        s3Bucket: '',
        graphUri: 'urn:foo:bar',
      }
      const cmd = {
        name: 'a name',
        baseUri: 'urn:foo:',
        graphUri: 'urn:foo:bar',
      }

      // when
      await updateProject(project, cmd, emitter)

      // then
      expect(emit).not.toHaveBeenCalled()
    })

    it('emits an event with new name', async () => {
      // given
      const project = {
        ...nullProject,
        name: 'foo',
        baseUri: 'urn:foo:',
        s3Bucket: '',
      }
      const cmd = {
        name: 'bar',
        baseUri: 'urn:foo:',
      }

      // when
      await updateProject(project, cmd, emitter)

      // then
      expect(emitter.emit.ProjectRenamed).toHaveBeenCalledWith({
        name: 'bar',
      })
    })

    it('emits an event with new base uri', async () => {
      // given
      const project = {
        ...nullProject,
        name: 'foo',
        baseUri: 'urn:foo:',
        s3Bucket: '',
      }
      const cmd = {
        name: 'foo',
        baseUri: 'urn:bar:',
      }

      // when
      await updateProject(project, cmd, emitter)

      // then
      expect(emitter.emit.ProjectRebased).toHaveBeenCalledWith({
        baseUri: 'urn:bar:',
      })
    })

    it('sets the name property', async () => {
      // given
      const project = {
        ...nullProject,
        name: 'foo',
        baseUri: 'urn:foo:',
        s3Bucket: '',
      }
      const cmd = {
        name: 'bar',
        baseUri: 'urn:foo:',
      }

      // when
      const newState = await updateProject(project, cmd, emitter)

      // then
      expect(newState.name).toBe('bar')
    })

    it('sets the baseUri property', async () => {
      // given
      const project = {
        ...nullProject,
        name: 'foo',
        baseUri: 'urn:foo:',
        s3Bucket: '',
      }
      const cmd = {
        name: 'foo',
        baseUri: 'urn:bar:',
      }

      // when
      const newState = await updateProject(project, cmd, emitter)

      // then
      expect(newState.baseUri).toBe('urn:bar:')
    })

    it('fails if name is missing', async () => {
      // given
      const project = {
        ...nullProject,
        name: 'foo',
        baseUri: 'urn:foo:',
        s3Bucket: '',
      }
      const cmd = {
        baseUri: 'urn:foo:',
      }

      // then
      await expect(updateProject(project, cmd as any, emitter)).rejects.toBeInstanceOf(DomainError)
    })

    it('fails if baseUri is missing', async () => {
      // given
      const project = {
        ...nullProject,
        name: 'foo',
        baseUri: 'urn:foo:',
        s3Bucket: '',
      }
      const cmd = {
        name: 'foo',
      }

      // then
      await expect(updateProject(project, cmd as any, emitter)).rejects.toBeInstanceOf(DomainError)
    })
  })
})
