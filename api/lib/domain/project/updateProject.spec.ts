import { updateProject } from './updateProject'
import { Project } from './index'
import { fakeDomainEventEmitter } from '../../__tests-helpers__'

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
      }, fakeDomainEventEmitter())

      // then
      expect(project).toHaveProperty('baseUri', 'http://example.com/')
    })
  })
})
