import { promises } from 'fs'

export async function saveFile (path: string, contents: string) {
  await promises.mkdir(process.env.STORAGE_FILESYSTEM_PATH, { recursive: true })

  return promises.writeFile(`${process.env.STORAGE_FILESYSTEM_PATH}/${path}`, contents)
}
