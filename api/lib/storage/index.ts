import * as localStorage from './local'
import * as awsStorage from './s3'
import { Readable } from 'stream'

interface FileStorage {
  saveFile (path: string, contents: string): Promise<any>
  deleteFile (path: string): Promise<any>
  loadFile (path: string): Readable | Promise<Readable>
}

let storage: FileStorage

if (process.env.STORAGE === 's3') {
  storage = awsStorage
} else {
  storage = localStorage
}

export default storage
