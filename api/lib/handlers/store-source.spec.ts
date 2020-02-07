import md5 from 'md5'
import storage from '../storage'
import { storeSampleHandler } from './store-source'

jest.mock('../storage')
jest.mock('md5')

const md5Mock = md5 as jest.Mock

describe('SourceUploaded', () => {
  describe('stores uploaded sample', () => {
    it('including the column names', () => {
      // given
      md5Mock.mockReturnValueOnce('hash')

      // when
      storeSampleHandler('sourceId', {
        columns: ['col1', 'col2'],
        sampleRows: [['row11', 'row12'], ['row21', 'row22']],
        fileName: '',
        projectId: 'project',
        delimiter: ';',
        quote: '"',
      })

      // then
      expect(storage.saveFile).toHaveBeenCalledWith('hash', `"col1";"col2"\n"row11";"row12"\n"row21";"row22"`)
    })
  })
})
