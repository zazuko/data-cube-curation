import { extractColumnIds } from './identifierTemplate'
import { parseGraph } from '../../__tests-helpers__'
import { getSourceColumns } from '../../read-graphs/source/getSourceColumns'

jest.mock('../../read-graphs/source/getSourceColumns')

const getSourceColumnsMock = getSourceColumns as jest.Mock

const sourceColumns = parseGraph(`
  <http://foo.bar/column1> a dataCube:Column; schema:name "first_name" .
  <http://foo.bar/column2> a dataCube:Column; schema:name "last_name" .
  <http://foo.bar/column2> a dataCube:Column; schema:name "unused_column" .
`)

describe('identifierTemplate', () => {
  describe('extractColumnIds', () => {
    it('fails when value is not well-formed URI template', async () => {
      // when
      const result = await extractColumnIds('irrelevant', 'http://x.y.z/{unclosed')

      // then
      expect(result).toBeInstanceOf(Error)
    })

    it('returns array of column ids found in source', async () => {
      // given
      getSourceColumnsMock.mockResolvedValueOnce(sourceColumns())

      // when
      const result = await extractColumnIds('source-id', 'http://x.y.z/{first_name}-{last_name}')

      // then
      expect(result).toMatchObject([
        'http://foo.bar/column1',
        'http://foo.bar/column2',
      ])
    })

    it('fails when column name is not found in source', async () => {
      // given
      getSourceColumnsMock.mockResolvedValueOnce(sourceColumns())

      // when
      const result = await extractColumnIds('source-id', 'http://x.y.z/{first_name}-{not_found}')

      // then
      expect(result).toBeInstanceOf(Error)
    })
  })
})
