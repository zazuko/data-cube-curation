import { createTable } from '.'

describe('table', () => {
  describe('createTable', () => {
    it('removes non-ASCII from table name', async () => {
      // given
      const command = {
        sourceId: '',
        projectId: 'http://example.com/project',
        tableName: 'Europäische Literatur',
      }

      // when
      const table = await createTable(command).state

      // then
      expect(table?.['@id']).toEqual('http://example.com/project/table/europaische-literatur')
    })
  })
})
