import aws from 'aws-sdk'
import * as Csvw from '@rdfine/csvw'
import { Readable, PassThrough } from 'stream'
import { isReadable } from 'isstream'
import NullWritable from 'null-writable'
import { Context } from 'barnard59-core/lib/Pipeline'

export async function openFile (this: Context, csvw: Csvw.Mapping, s3Endpoint: string, s3Bucket: string) {
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

export function uploadFile (this: Context, fileName: string, s3Endpoint: string, s3Bucket: string) {
  const quadStream = new PassThrough()

  const s3 = new aws.S3({
    endpoint: s3Endpoint,
  })

  s3.upload({
    Bucket: s3Bucket,
    Key: fileName,
    Body: quadStream,
  }).on('httpUploadProgress', progress => {
    this.log.info(`Uploaded ${progress.loaded / 1024} of ${progress.total / 1024 || '?'} kB`)
  }).send((err, data) => {
    if (err) {
      this.log.error(err)
      quadStream.destroy(err)
    } else {
      this.log.info(`Transformed triples saved to ${data.Location}`)
      quadStream.destroy()
    }
  })

  return quadStream
}

export function devNull () {
  return new NullWritable()
}
