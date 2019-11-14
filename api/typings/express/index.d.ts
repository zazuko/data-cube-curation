import SparqlHttp from 'sparql-http-client'

declare module 'express' {

  interface Request {
    sparql: SparqlHttp;
    graph: any;
  }

  interface Response {
    graph(dataset: any): void;
    setLink(url: string, rel: string): void;
  }
}
