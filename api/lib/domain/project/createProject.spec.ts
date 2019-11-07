import { createProject } from './createProject'
import { DomainError } from '@tpluscode/fun-ddr'

describe('project', () => {
  describe('create', () => {
    it('returns a project with the name', async () => {
      // when
      const project = await createProject({
        name: 'foo',
      })

      // then
      await expect(project.state).resolves.toHaveProperty('name', 'foo')
      await expect(project.state).resolves.toHaveProperty('@id')
    })

    it('uses the uri slug in project identifier', async () => {
      // when
      const project = await createProject({
        name: 'foo',
        uriSlug: 'bar',
      })

      // then
      await expect(project.state).resolves.toHaveProperty('@id', '/project/bar')
    })

    it('fails when name is not a string', async () => {
      // given
      const command = {
        name: {} as any,
      }

      // when
      const ar = createProject(command)

      // then
      await expect(ar.error).resolves.toBeInstanceOf(DomainError)
    })
  })
})
