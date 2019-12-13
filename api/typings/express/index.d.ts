import SparqlHttp from 'sparql-http-client'
import { Dataset, Stream } from 'rdf-js'
import DatasetExt from 'rdf-ext/lib/Dataset'

declare module 'express' {

  interface Request {
    sparql: SparqlHttp;
    graph: DatasetExt;
    resourceId: string;
    resourcePath: string;
  }

  interface Response {
    graph(dataset: Stream | Dataset): void;
  }
}
