/* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
import { addDimensionTable } from './createDimensionTable'
import { Project } from './index'
import { DomainError } from '@tpluscode/fun-ddr'
import { hasSource } from '../../read-graphs/project'
import { templateIsValid } from '../table/identifierTemplate'

jest.mock('../../read-graphs/project')
jest.mock('../table/identifierTemplate')
const projectHasSourceMock = hasSource as jest.Mock
const templateIsValidMock = templateIsValid as jest.Mock

describe('project', () => {
  beforeAll(() => {
    projectHasSourceMock.mockReturnValue(true)
    templateIsValidMock.mockResolvedValue(true)
  })

  describe('create dimension table', () => {
    it('creates a dataCube:Table aggregate', async () => {
      // given
      const project = {
        '@id': '/project/test',
      } as Project

      // when
      const result = await addDimensionTable(project, {
        sourceId: '/project/test/source',
        tableName: 'Table One',
        identifierTemplate: '/dimension/{column}',
      })

      // then
      await expect(result.state).resolves.toMatchSnapshot()
    })

    it('publishes an event', async () => {
      // given
      const project = {
        '@id': '/project/test',
      } as Project

      // when
      const result = await addDimensionTable(project, {
        sourceId: '/project/test/source',
        tableName: 'Table One',
        identifierTemplate: '/dimension/{column}',
      })

      // then
      await expect(result.events).resolves.toMatchSnapshot()
    })

    it('throws when name is missing', async () => {
      // given
      const project = {
        '@id': '/project/test',
      } as Project
      const command = {
        sourceId: '/project/test/source',
        identifierTemplate: '/dimension/{column}',
      } as any

      // when
      const result = await addDimensionTable(project, command)

      // then
      await expect(result.error).resolves.toBeInstanceOf(DomainError)
    })

    it('throws when source does not belong to the project', async () => {
      // given
      const project = {
        '@id': '/project/test',
      } as Project
      const command = {
        sourceId: '/project/test/source',
        tableName: 'Test',
        identifierTemplate: '/dimension/{column}',
      }
      projectHasSourceMock.mockReturnValueOnce(false)

      // when
      const result = await addDimensionTable(project, command)

      // then
      await expect(result.error).resolves.toBeInstanceOf(DomainError)
    })

    it('throws when template did not pass validation', async () => {
      // given
      const project = {
        '@id': '/project/test',
      } as Project
      const command = {
        sourceId: '/project/test/source',
        tableName: 'Test',
        identifierTemplate: '/dimension/{column}',
      }
      templateIsValidMock.mockResolvedValueOnce(false)

      // when
      const result = await addDimensionTable(project, command)

      // then
      await expect(result.error).resolves.toBeInstanceOf(DomainError)
    })
  })
})
