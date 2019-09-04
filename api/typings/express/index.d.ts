import { Request } from 'express'

declare module 'express' {
  interface DataCubeRequest extends Request {
    sparql: any;
  }
}
