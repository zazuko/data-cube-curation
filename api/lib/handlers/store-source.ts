import md5 from 'md5'
import { handle } from 'fun-ddr'
import { SourceEvents } from '../domain/source/events'
import { deleteFile, saveFile } from '../storage'
import { CoreEvents } from 'fun-ddr/lib/events'

handle<SourceEvents, 'SourceUploaded'>('SourceUploaded', function storeSample (ev) {
  const csvStringified = ev.data.sampleRows.map(row => row.map(cell => `"${cell}"`).join(';')).join('\n')

  return saveFile(md5(ev.id), csvStringified)
})

handle<CoreEvents, 'AggregateDeleted'>('AggregateDeleted', function deleteSampleCsv (ev) {
  if (ev.data.types.includes('Source')) {
    deleteFile(md5(ev.id))
  }
})
