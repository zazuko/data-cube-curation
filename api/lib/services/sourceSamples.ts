import md5 from 'md5'
import { loadFile } from '../storage'

export function loadSourceSample (sourceId: string) {
  const pathName = md5(sourceId)
  return loadFile(pathName)
}
