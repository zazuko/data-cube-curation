import { DomainEventEmitter } from '@tpluscode/fun-ddr/lib'
import { DomainError } from '@tpluscode/fun-ddr'
import { update } from './update'
import { DimensionTable, FactTable } from './index'
import { fakeDomainEventEmitter } from '../../__tests-helpers__'
import { TableEvents } from './events'
import { extractColumns } from './identifierTemplate'

jest.mock('./identifierTemplate')
const extractColumnIdsMock = extractColumns as jest.Mock

describe('table', () => {
  let emitter: DomainEventEmitter<TableEvents>

  beforeEach(() => {
    emitter = fakeDomainEventEmitter(jest.fn())
  })

  describe('update', () => {
    describe('when identifier changes', () => {
      it('emits event', async () => {
      // given
        const table: FactTable = {
          '@id': 'table',
          '@type': 'FactTable',
          tableName: 'foo',
          projectId: 'projectId',
          sourceId: 'sourceId',
          identifierTemplate: 'before',
        }
        const command = {
          name: 'foo',
          identifierTemplate: 'after',
        }

        // when
        await update(table, command, emitter)

        // then
        expect(emitter.emit.TableIdentifierTemplateChanged).toHaveBeenCalledWith({
          identifierTemplate: 'after',
        })
      })

      it('updates state', async () => {
      // given
        const table: FactTable = {
          '@id': 'table',
          '@type': 'FactTable',
          tableName: 'foo',
          projectId: 'projectId',
          sourceId: 'sourceId',
          identifierTemplate: 'before',
        }
        const command = {
          name: 'foo',
          identifierTemplate: 'after',
        }

        // when
        const changed = await update(table, command, emitter)

        // then
        expect(changed.identifierTemplate).toEqual(command.identifierTemplate)
      })

      it('throws when template validation fails', async () => {
        // given
        const table: DimensionTable = {
          '@id': 'table',
          '@type': 'FactTable',
          tableName: 'foo',
          projectId: 'projectId',
          sourceId: 'sourceId',
          identifierTemplate: '/{foo}',
        }
        const command = {
          name: 'foo',
          identifierTemplate: '/{foo',
        }

        // when
        extractColumnIdsMock.mockResolvedValueOnce(new Error('Validation failed'))

        // then
        await expect(update(table, command, emitter)).rejects.toBeInstanceOf(DomainError)
      })
    })

    describe('when name changes', () => {
      it('emits event', async () => {
      // given
        const table: FactTable = {
          '@id': 'table',
          '@type': 'FactTable',
          tableName: 'foo',
          projectId: 'projectId',
          sourceId: 'sourceId',
          identifierTemplate: '/{foo}',
        }
        const command = {
          name: 'bar',
          identifierTemplate: '/{foo}',
        }

        // when
        await update(table, command, emitter)

        // then
        expect(emitter.emit.TableNameChanged).toHaveBeenCalledWith({
          name: 'bar',
        })
      })

      it('updates state', async () => {
      // given
        const table: FactTable = {
          '@id': 'table',
          '@type': 'FactTable',
          tableName: 'foo',
          projectId: 'projectId',
          sourceId: 'sourceId',
          identifierTemplate: '/{foo}',
        }
        const command = {
          name: 'bar',
          identifierTemplate: '/{bar}',
        }

        // when
        const changed = await update(table, command, emitter)

        // then
        expect(changed.tableName).toEqual(command.name)
      })
    })

    it('throws when name is missing', async () => {
      // given
      const table: DimensionTable = {
        '@id': 'table',
        '@type': 'DimensionTable',
        tableName: 'foo',
        projectId: 'projectId',
        sourceId: 'sourceId',
        identifierTemplate: '/{foo}',
      }
      const command = {
        identifierTemplate: '/{foo}',
      } as any

      // then
      await expect(update(table, command, emitter)).rejects.toBeInstanceOf(DomainError)
    })

    describe('when it is a DimensionTable', () => {
      it('throws when template is missing', async () => {
        // given
        const table: DimensionTable = {
          '@id': 'table',
          '@type': 'DimensionTable',
          tableName: 'foo',
          projectId: 'projectId',
          sourceId: 'sourceId',
          identifierTemplate: '/{foo}',
        }
        const command = {
          name: 'foo',
        }

        // then
        await expect(update(table, command, emitter)).rejects.toBeInstanceOf(DomainError)
      })

      it('throws when template is malformed', async () => {
        // given
        const table: DimensionTable = {
          '@id': 'table',
          '@type': 'DimensionTable',
          tableName: 'foo',
          projectId: 'projectId',
          sourceId: 'sourceId',
          identifierTemplate: '/{foo}',
        }
        const command = {
          name: 'foo',
          identifierTemplate: '/{foo',
        }

        // when
        extractColumnIdsMock.mockResolvedValueOnce(new Error('Validation failed'))

        // then
        await expect(update(table, command, emitter)).rejects.toBeInstanceOf(DomainError)
      })
    })
  })
})
