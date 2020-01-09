import urlSlug from 'url-slug'
import { URL } from 'url'

export const temporaryUri = (name: string) => `http://cube.data/${urlSlug(name)}/`

export const ensureSlash = <T = string | undefined>(uri: T): T extends undefined ? string | undefined : string => {
  if (typeof uri === 'string') {
    try {
      return new URL(uri.toString()).toString() as any
    } catch (e) {}
  }

  return uri as any
}
