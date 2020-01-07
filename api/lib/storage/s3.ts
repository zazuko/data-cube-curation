import aws from 'aws-sdk'
import { Readable } from 'stream'
import { isReadable } from 'isstream'
import { log } from '../log'
import env from '../env'

const logError = log.extend('s3').extend('error')

export default function () {
  const s3 = new aws.S3({
    endpoint: env.AWS_S3_ENDPOINT,
  })

  const defaultS3Options = {
    Bucket: env.AWS_S3_BUCKET,
  }

  return {
    saveFile (path: string, contents: string) {
      const upload = s3.upload({
        ...defaultS3Options,
        Body: contents,
        Key: path,
      })

      return upload.promise()
    },

    deleteFile (path: string) {
      return s3.deleteObject({
        ...defaultS3Options,
        Key: path,
      }).promise()
    },

    async loadFile (path: string) {
      const file = await s3.getObject({
        ...defaultS3Options,
        Key: path,
      }).promise()

      if (file.Body instanceof Buffer) {
        const readable = new Readable()
        readable._read = () => {
        }
        readable.push(file.Body)
        readable.push(null)
        return readable
      }

      if (isReadable(file.Body)) {
        return file.Body as Readable
      }

      logError('Could not read file "%s" from S3. It was neither Buffer or Readable', path)
      return null
    },
  }
}
