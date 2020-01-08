import { promises, createReadStream, existsSync } from 'fs'
import env from '../env'

export async function saveFile (path: string, contents: string) {
  await promises.mkdir(env.STORAGE_FILESYSTEM_PATH, { recursive: true })

  return promises.writeFile(`${env.STORAGE_FILESYSTEM_PATH}/${path}`, contents)
}

export async function deleteFile (path: string) {
  return promises.unlink(`${env.STORAGE_FILESYSTEM_PATH}/${path}`)
}

export function loadFile (path: string) {
  if (!existsSync(`${env.STORAGE_FILESYSTEM_PATH}/${path}`)) {
    return null
  }

  return createReadStream(`${env.STORAGE_FILESYSTEM_PATH}/${path}`)
}
