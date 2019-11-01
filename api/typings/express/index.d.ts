import { Request, Response } from 'express'
import SparqlHttp from 'sparql-http-client'

declare module 'express' {

  interface DataCubeRequest extends Request {
    sparql: SparqlHttp
    graph: any
  }

  interface DataCubeResponse extends Response {
    graph(dataset: any): void
    setLink(url: string, rel: string): void
  }
}
