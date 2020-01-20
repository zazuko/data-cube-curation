import SparqlHttp from 'sparql-http-client'
import { Constructor, RdfResourceImpl } from '@tpluscode/rdfine'
import DatasetExt = require('rdf-ext/lib/Dataset')

declare module 'express' {

  interface Request {
    sparql: SparqlHttp;
    graph: DatasetExt;
    resourceId: string;
    resourcePath: string;
    buildModel <T extends RdfResourceImpl> (Class: Constructor<T>): T;
  }

  interface Response {
    graph(dataset: any): void;
  }
}
