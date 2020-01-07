import { renameProject } from './index'
import { DomainEventEmitter } from '@tpluscode/fun-ddr/lib'

describe('Project', () => {
  const nullProject = {
    '@id': 'foo',
    '@type': 'Project',
    archived: 'false' as 'true' | 'false',
  }

  let emitter: DomainEventEmitter
  beforeEach(() => {
    emitter = {
      emit: jest.fn(),
    }
  })

  describe('rename command', () => {
    it('does not emit event when new name is same as current', async () => {
      // given
      const project = {
        ...nullProject,
        name: 'a name',
      }
      const cmd = {
        newName: 'a name',
      }

      // when
      await renameProject(project, cmd, emitter)

      // then
      expect(emitter.emit).not.toHaveBeenCalled()
    })

    it('emits an event with new name', async () => {
      // given
      const project = {
        ...nullProject,
        name: 'foo',
      }
      const cmd = {
        newName: 'bar',
      }

      // when
      await renameProject(project, cmd, emitter)

      // then
      expect(emitter.emit).toHaveBeenCalledWith('ProjectRenamed', {
        name: 'bar',
      })
    })

    it('sets the name property', async () => {
      // given
      const project = {
        ...nullProject,
        name: 'foo',
      }
      const cmd = {
        newName: 'bar',
      }

      // when
      const newState = await renameProject(project, cmd, emitter)

      // then
      expect(newState.name).toBe('bar')
    })
  })
})
