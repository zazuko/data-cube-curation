import { extractColumns } from './identifierTemplate'
import { parseGraph } from '../../__tests-helpers__'
import { getSourceColumns } from '../../read-graphs/source/getSourceColumns'

jest.mock('../../read-graphs/source/getSourceColumns')

const getSourceColumnsMock = getSourceColumns as jest.Mock

const sourceColumns = parseGraph(`
  <http://foo.bar/column1> a dataCube:Column; schema:name "first_name" .
  <http://foo.bar/column2> a dataCube:Column; schema:name "last_name" .
  <http://foo.bar/column2> a dataCube:Column; schema:name "unused_column" .
  <http://foo.bar/column-with-spaces-and-others> a dataCube:Column; schema:name "Fahrzeug größe" .
`)

describe('identifierTemplate', () => {
  describe('extractColumnIds', () => {
    it('fails when value is not well-formed URI template', async () => {
      // when
      const result = await extractColumns('irrelevant', 'http://x.y.z/{unclosed')

      // then
      expect(result).toBeInstanceOf(Error)
    })

    it('returns array of column ids found in source', async () => {
      // given
      getSourceColumnsMock.mockResolvedValueOnce(sourceColumns())

      // when
      const result = await extractColumns('source-id', 'http://x.y.z/{first_name}-{last_name}')

      // then
      expect(result).toMatchObject([
        { id: 'http://foo.bar/column1', name: 'first_name' },
        { id: 'http://foo.bar/column2', name: 'last_name' },
      ])
    })

    it('correctly matches percent-encoded names', async () => {
      // given
      getSourceColumnsMock.mockResolvedValueOnce(sourceColumns())

      // when
      const result = await extractColumns('source-id', 'http://x.y.z/{Fahrzeug%20gr%C3%B6%C3%9Fe}')

      // then
      expect(result).toMatchObject([
        { id: 'http://foo.bar/column-with-spaces-and-others', name: 'Fahrzeug größe' },
      ])
    })

    it('fails when column name is not found in source', async () => {
      // given
      getSourceColumnsMock.mockResolvedValueOnce(sourceColumns())

      // when
      const result = await extractColumns('source-id', 'http://x.y.z/{first_name}-{not_found}')

      // then
      expect(result).toBeInstanceOf(Error)
    })
  })
})
