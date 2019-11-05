import md5 from 'md5'
import storage from '../storage'

export function loadSourceSample (sourceId: string) {
  const pathName = md5(sourceId)
  return storage.loadFile(pathName)
}
