import SparqlHttp from 'sparql-http-client'

declare module 'express' {

  interface Request {
    sparql: SparqlHttp;
    graph: any;
    resourceId: string;
    resourcePath: string;
  }

  interface Response {
    graph(dataset: any): void;
  }
}
