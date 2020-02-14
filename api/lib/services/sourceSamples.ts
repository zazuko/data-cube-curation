import md5 from 'md5'
import parse from 'csv-parse'
import storage from '../storage'

export const dialect = {
  delimiter: ';',
  quote: '"',
}

export function loadSourceSample (sourceId: string) {
  const pathName = md5(sourceId)
  return storage.loadFile(pathName)
}

export async function loadSampleRows (sourceId: string, limit: number, offset: number) {
  const result: string[][] = []
  const fileStream = await loadSourceSample(sourceId)

  if (fileStream == null) {
    return null
  }

  return new Promise<string[][]>((resolve) => {
    const parser = parse({
      to: offset + 1 + limit,
      from: offset + 2,
      delimiter: ';',
    })

    parser.on('readable', () => {
      let record: string[]
      while (true) {
        record = parser.read()
        if (record) {
          result.push(record)
        } else {
          break
        }
      }
    })

    parser.on('end', () => {
      resolve(result)
    })

    fileStream.pipe(parser)
  })
}
