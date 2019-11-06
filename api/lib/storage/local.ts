import { promises, createReadStream, existsSync } from 'fs'

export async function saveFile (path: string, contents: string) {
  await promises.mkdir(process.env.STORAGE_FILESYSTEM_PATH, { recursive: true })

  return promises.writeFile(`${process.env.STORAGE_FILESYSTEM_PATH}/${path}`, contents)
}

export async function deleteFile (path: string) {
  return promises.unlink(`${process.env.STORAGE_FILESYSTEM_PATH}/${path}`)
}

export function loadFile (path: string) {
  if (!existsSync(`${process.env.STORAGE_FILESYSTEM_PATH}/${path}`)) {
    return null
  }

  return createReadStream(`${process.env.STORAGE_FILESYSTEM_PATH}/${path}`)
}
