import { createSource } from './createSource'
import { DomainError } from '@tpluscode/fun-ddr'
import { Project } from './index'

describe('source', () => {
  describe('create', () => {
    it('returns error when any column is empty string', async () => {
      // given
      const command = {
        fileName: 'animals.csv',
        type: 'csv' as const,
        sample: [],
        columns: ['foo', 'bar', ''],
      }
      const project: Partial<Project> = {
        '@id': '/project/foo',
        '@type': 'Project',
      }

      // when
      const result = await createSource(project as any, command)

      // then
      await expect(result.error).resolves.toBeInstanceOf(DomainError)
    })

    it('returns error when any column is whitespace', async () => {
      // given
      const command = {
        fileName: 'animals.csv',
        type: 'csv' as const,
        sample: [],
        columns: ['foo', 'bar', ' '],
      }
      const project: Partial<Project> = {
        '@id': '/project/foo',
        '@type': 'Project',
      }

      // when
      const result = await createSource(project as any, command)

      // then
      await expect(result.error).resolves.toBeInstanceOf(DomainError)
    })

    it('returns error when any column is null', async () => {
      // given
      const command = {
        fileName: 'animals.csv',
        type: 'csv' as const,
        sample: [],
        columns: ['foo', 'bar', null],
      }
      const project: Partial<Project> = {
        '@id': '/project/foo',
        '@type': 'Project',
      }

      // when
      const result = await createSource(project as any, command as any)

      // then
      await expect(result.error).resolves.toBeInstanceOf(DomainError)
    })
  })
})
