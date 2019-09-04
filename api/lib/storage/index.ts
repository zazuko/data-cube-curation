import { promises } from 'fs'

export async function saveFile (path: string, contents: string) {
  await promises.mkdir(process.env.FILESYSTEM_FILE_STORAGE_PATH, { recursive: true })

  return promises.writeFile(`${process.env.FILESYSTEM_FILE_STORAGE_PATH}/${path}`, contents)
}
