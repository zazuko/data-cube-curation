import * as localStorage from './local'
import * as awsStorage from './s3'
import { Readable } from 'stream'
import env from '../env'

interface FileStorage {
  saveFile (path: string, contents: string): Promise<any>;
  deleteFile (path: string): Promise<any>;
  loadFile (path: string): Readable | Promise<Readable | null> | null;
}

let storage: FileStorage

if (env.has.STORAGE && env.STORAGE === 's3') {
  storage = awsStorage
} else {
  storage = localStorage
}

export default storage
