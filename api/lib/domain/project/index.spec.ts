import { renameProject } from './index'

describe('Project', () => {
  const nullProject = {
    '@id': 'foo',
    '@type': 'Project',
    archived: false,
  }

  let emitter
  beforeEach(() => {
    emitter = {
      emit: jest.fn(),
    }
  })

  describe('rename command', () => {
    it('does not emit event when new name is same as current', () => {
      // given
      const project = {
        ...nullProject,
        name: 'a name',
      }
      const cmd = {
        newName: 'a name',
      }

      // when
      renameProject(project, cmd, emitter)

      // then
      expect(emitter.emit).not.toHaveBeenCalled()
    })

    it('emits an event with new name', () => {
      // given
      const project = {
        ...nullProject,
        name: 'foo',
      }
      const cmd = {
        newName: 'bar',
      }

      // when
      renameProject(project, cmd, emitter)

      // then
      expect(emitter.emit).toHaveBeenCalledWith('ProjectRenamed', {
        name: 'bar',
      })
    })

    it('sets the name property', () => {
      // given
      const project = {
        ...nullProject,
        name: 'foo',
      }
      const cmd = {
        newName: 'bar',
      }

      // when
      const newState = renameProject(project, cmd, emitter)

      // then
      expect(newState.name).toBe('bar')
    })
  })
})
