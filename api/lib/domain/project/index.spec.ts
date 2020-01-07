import { updateProject } from './index'
import { DomainError } from '@tpluscode/fun-ddr'

describe('Project', () => {
  const nullProject = {
    '@id': 'foo',
    '@type': 'Project',
    archived: 'false' as 'true' | 'false',
  }

  let emitter
  beforeEach(() => {
    emitter = {
      emit: jest.fn(),
    }
  })

  describe('rename command', () => {
    it('does not emit event when nothing changes', async () => {
      // given
      const project = {
        ...nullProject,
        name: 'a name',
        baseUri: 'urn:foo:',
      }
      const cmd = {
        newName: 'a name',
        baseUri: 'urn:foo:',
      }

      // when
      await updateProject(project, cmd, emitter)

      // then
      expect(emitter.emit).not.toHaveBeenCalled()
    })

    it('emits an event with new name', async () => {
      // given
      const project = {
        ...nullProject,
        name: 'foo',
        baseUri: 'urn:foo:',
      }
      const cmd = {
        newName: 'bar',
        baseUri: 'urn:foo:',
      }

      // when
      await updateProject(project, cmd, emitter)

      // then
      expect(emitter.emit).toHaveBeenCalledWith('ProjectRenamed', {
        name: 'bar',
      })
    })

    it('emits an event with new base uri', async () => {
      // given
      const project = {
        ...nullProject,
        name: 'foo',
        baseUri: 'urn:foo:',
      }
      const cmd = {
        newName: 'foo',
        baseUri: 'urn:bar:',
      }

      // when
      await updateProject(project, cmd, emitter)

      // then
      expect(emitter.emit).toHaveBeenCalledWith('ProjectRebased', {
        baseUri: 'urn:bar:',
      })
    })

    it('sets the name property', async () => {
      // given
      const project = {
        ...nullProject,
        name: 'foo',
        baseUri: 'urn:foo:',
      }
      const cmd = {
        newName: 'bar',
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
      }
      const cmd = {
        newName: 'foo',
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
      }
      const cmd = {
        newName: 'foo',
      }

      // then
      await expect(updateProject(project, cmd as any, emitter)).rejects.toBeInstanceOf(DomainError)
    })
  })
})
