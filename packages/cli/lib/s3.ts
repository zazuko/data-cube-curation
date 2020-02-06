import aws from 'aws-sdk'
import * as Csvw from '@rdfine/csvw'
import { Readable } from 'stream'
import { isReadable } from 'isstream'

export async function openFile (this: any, csvw: Csvw.Mapping, s3Endpoint: string, s3Bucket: string) {
  this.log.info(`Opening file ${csvw.url} from S3`)

  const s3 = new aws.S3({
    endpoint: s3Endpoint,
  })

  const file = await s3.getObject({
    Bucket: s3Bucket,
    Key: csvw.url,
  }).promise()

  if (file.Body instanceof Buffer) {
    const readable = new Readable()
    readable._read = () => { }
    readable.push(file.Body)
    readable.push(null)
    return readable
  }

  if (isReadable(file.Body)) {
    return file.Body as Readable
  }

  throw new Error(`Could not read file "${csvw.url}" from S3. It was neither Buffer or Readable`)
}
