import SparqlHttp from 'sparql-http-client'
import { Constructor, RdfResourceImpl } from '@tpluscode/rdfine'
import { NamedNode } from 'rdf-js'
import DatasetExt = require('rdf-ext/lib/Dataset')

declare module 'express' {

  interface Request {
    sparql: SparqlHttp;
    graph: DatasetExt;
    resourceId: string;
    resourcePath: string;
    buildModel <T extends RdfResourceImpl> (Class: Constructor<T> & { types: NamedNode[] }, ids?: (string | NamedNode)[]): T[];
  }

  interface Response {
    graph(dataset: any): void;
  }
}
