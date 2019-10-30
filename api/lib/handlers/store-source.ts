import md5 from 'md5'
import { handle, CoreEvents } from '@tpluscode/fun-ddr'
import { SourceEvents } from '../domain/source/events'
import storage from '../storage'

export const storeSampleHandler = handle<SourceEvents, 'SourceUploaded'>('SourceUploaded', function storeSample (ev) {
  const csvStringified = [ev.data.columns, ...ev.data.sampleRows].map(row => row.map(cell => `"${cell}"`).join(';')).join('\n')

  storage.saveFile(md5(ev.id), csvStringified)
})

handle<CoreEvents, 'AggregateDeleted'>('AggregateDeleted', function deleteSampleCsv (ev) {
  if (ev.data.types.includes('Source')) {
    storage.deleteFile(md5(ev.id))
  }
})
