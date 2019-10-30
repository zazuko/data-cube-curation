import aws from 'aws-sdk'
import { Readable } from 'stream'

const s3 = new aws.S3({
  endpoint: process.env.AWS_S3_ENDPOINT,
})

const defaultS3Options = {
  Bucket: process.env.AWS_S3_BUCKET,
}

export async function saveFile (path: string, contents: string) {
  const upload = s3.upload({
    ...defaultS3Options,
    Body: contents,
    Key: path,
  })

  return upload.promise()
}

export async function deleteFile (path: string) {
  return s3.deleteObject({
    ...defaultS3Options,
    Key: path,
  }).promise()
}

export async function loadFile (path: string) {
  const file = await s3.getObject({
    ...defaultS3Options,
    Key: path,
  }).promise()

  return file.Body as Readable
}
