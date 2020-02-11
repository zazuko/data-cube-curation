import { updateProject } from './updateProject'
import { Project } from './index'

describe('project', () => {
  describe('update', () => {
    it('ensures that domain-only base URI ends with a slash', async () => {
      // given
      let project: Project = {
        baseUri: 'http://foo.bar/',
      } as any

      // when
      project = await updateProject(project, {
        newName: 'foo',
        baseUri: 'http://example.com',
      }, {
        emit: new Proxy({}, { get: jest.fn() }),
        emitFrom: jest.fn(),
      })

      // then
      expect(project).toHaveProperty('baseUri', 'http://example.com/')
    })
  })
})
