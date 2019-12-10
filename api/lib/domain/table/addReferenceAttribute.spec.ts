import $rdf from 'rdf-ext'
import { DomainError } from '@tpluscode/fun-ddr'
import { addReferenceAttribute } from './addReferenceAttribute'
import { Table } from './index'
import { expand } from '@zazuko/rdf-vocabularies'
import { existsInTableSource, getTableSourceId } from '../../read-graphs/table'
import { sourceWithColumnGraph } from './addReferenceAttribute.spec-graphs'
import { getSourceColumns } from '../../read-graphs/source/getSourceColumns'
import { extractColumns } from './identifierTemplate'

jest.mock('../../read-graphs/table')
jest.mock('../../read-graphs/source/getSourceColumns')
jest.mock('../../read-graphs/table/dimensionTable')
jest.mock('./identifierTemplate')

const existsInTableSourceMock = existsInTableSource as jest.Mock
const getSourceColumnsMock = getSourceColumns as jest.Mock
const getTableSourceIdMock = getTableSourceId as jest.Mock
const extractColumnIdsMock = extractColumns as jest.Mock

const sourceTableSourceId = 'http://example.com/source'
const referencedTableSourceId = 'http://example.com/destination'

describe('table', () => {
  let table: Table

  const command = {
    name: 'foo-bar',
    predicate: expand('schema:name'),
    referencedTableId: 'table/other',
    columnMappings: [ ],
  }

  beforeEach(() => {
    existsInTableSourceMock.mockReset()
    getSourceColumnsMock.mockReset()
    getTableSourceIdMock.mockResolvedValue(referencedTableSourceId)
    extractColumnIdsMock.mockResolvedValue([
      { id: `${referencedTableSourceId}/column1`, name: 'foo' },
    ])

    table = {
      '@id': 'example/table',
      '@type': 'Table',
      sourceId: sourceTableSourceId,
      projectId: 'unimportant/project',
      tableName: 'Example',
    }
    command.columnMappings = []
  })

  describe('add reference attribute', () => {
    it('errors when predicate is missing', async () => {
      // given
      const cmd = { ...command }
      delete cmd.predicate

      // when
      const result = await addReferenceAttribute(table, cmd)

      // then
      await expect(result.error).resolves.toBeInstanceOf(DomainError)
    })

    it('errors when referenced table id is missing', async () => {
      // given
      const cmd = { ...command }
      delete cmd.referencedTableId

      // when
      const result = await addReferenceAttribute(table, cmd)

      // then
      await expect(result.error).resolves.toBeInstanceOf(DomainError)
    })

    it('errors when referenced table not found', async () => {
      // given
      getTableSourceIdMock.mockResolvedValueOnce(null)

      // when
      const result = await addReferenceAttribute(table, command)

      // then
      await expect(result.error).resolves.toBeInstanceOf(DomainError)
    })

    it('errors when referencing column does not exist', async () => {
      // given
      getSourceColumnsMock.mockImplementation((id) => {
        return id === sourceTableSourceId
          ? Promise.resolve($rdf.dataset())
          : sourceWithColumnGraph(id)
      })
      command.columnMappings.push({
        sourceColumnId: `${sourceTableSourceId}/column1`,
        referencedColumnId: `${referencedTableSourceId}/column1`,
      })

      // when
      const result = await addReferenceAttribute(table, command)

      // then
      await expect(result.error).resolves.toBeInstanceOf(DomainError)
    })

    it('errors when referenced column does not exist', async () => {
      // given
      getSourceColumnsMock.mockImplementation((id) => {
        return id !== sourceTableSourceId
          ? Promise.resolve($rdf.dataset())
          : sourceWithColumnGraph(id)
      })
      command.columnMappings.push({
        sourceColumnId: `${sourceTableSourceId}/column1`,
        referencedColumnId: `${referencedTableSourceId}/column1`,
      })

      // when
      const result = await addReferenceAttribute(table, command)

      // then
      await expect(result.error).resolves.toBeInstanceOf(DomainError)
    })

    it('errors when attribute does not reference all identifier template columns', async () => {
      // given
      extractColumnIdsMock.mockResolvedValueOnce([
        { id: `${referencedTableSourceId}/column1` },
        { id: `${referencedTableSourceId}/column2` },
      ])
      getSourceColumnsMock.mockImplementation(sourceWithColumnGraph)
      command.columnMappings.push({
        sourceColumnId: `${sourceTableSourceId}/column1`,
        referencedColumnId: `${referencedTableSourceId}/column1`,
      })

      // when
      const result = await addReferenceAttribute(table, command)

      // then
      await expect(result.error).resolves.toBeInstanceOf(DomainError)
    })

    it('errors when referenced table parameter is missing', async () => {
      // given
      const cmd = { ...command }
      delete cmd.referencedTableId

      // when
      const result = await addReferenceAttribute(table, cmd)

      // then
      await expect(result.error).resolves.toBeInstanceOf(Error)
    })

    it('return expected state', async () => {
      // given
      getSourceColumnsMock.mockImplementation(sourceWithColumnGraph)
      command.columnMappings.push({
        sourceColumnId: `${sourceTableSourceId}/column1`,
        referencedColumnId: `${referencedTableSourceId}/column1`,
      })

      // when
      const result = await addReferenceAttribute(table, command)

      // then
      const state = await result.state
      expect(state).toMatchSnapshot({
        '@id': expect.stringMatching(new RegExp('example/table/attribute/.+')),
      })
    })

    it('emits an event', async () => {
      // given
      getSourceColumnsMock.mockImplementation(sourceWithColumnGraph)
      command.columnMappings.push({
        sourceColumnId: `${sourceTableSourceId}/column1`,
        referencedColumnId: `${referencedTableSourceId}/column1`,
      })

      // when
      const result = await addReferenceAttribute(table, command)

      // then
      await expect(result.events).resolves.toMatchSnapshot()
    })
  })
})
