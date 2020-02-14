import md5 from 'md5'
import { CoreEvents } from '@tpluscode/fun-ddr'
import handle from '../domain/source/events'
import storage from '../storage'
import { dialect } from '../services/sourceSamples'

export const storeSampleHandler = handle.sourceEvents.on.CsvSourceUploaded(function storeSample (ev) {
  const csvStringified = [ev.data.columns, ...ev.data.sampleRows].map(row => row.map(cell => `${dialect.quote}${cell}${dialect.quote}`).join(dialect.delimiter)).join('\n')

  storage.saveFile(md5(ev.id), csvStringified)
})

CoreEvents.on.AggregateDeleted(function deleteSampleCsv (ev) {
  if (ev.data.types.includes('Source')) {
    storage.deleteFile(md5(ev.id))
  }
})
