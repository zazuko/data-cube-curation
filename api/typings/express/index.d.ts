import { Request, Response } from 'express'

declare module 'express' {
  interface DataCubeRequest extends Request {
    sparql: any;
  }

  interface DataCubeResponse extends Response {
    graph(dataset: any): void;
    setLink(url: string, rel: string): void;
  }
}
