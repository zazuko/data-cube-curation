import md5 from 'md5'
import { handle } from '../ddd/events'
import { SourceEvents } from '../domain/source/events'
import { saveFile } from '../storage'

handle<SourceEvents, 'SourceUploaded'>('SourceUploaded', function storeSample (ev) {
  const csvStringified = ev.data.sampleRows.map(row => row.map(cell => `"${cell}"`).join(';')).join('\n')

  return saveFile(md5(ev.id), csvStringified)
})
