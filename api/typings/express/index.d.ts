import SparqlHttp from 'sparql-http-client'
import { Constructor, RdfResource, RdfResourceImpl } from '@tpluscode/rdfine'
import { NamedNode, DatasetCore, Stream } from 'rdf-js'
import DatasetExt = require('rdf-ext/lib/Dataset')

declare module 'express' {

  interface Request {
    sparql: SparqlHttp;
    graph: DatasetExt;
    resourceId: string;
    resourcePath: string;
    buildModel <T extends RdfResourceImpl> (Class: Constructor<T> & { types?: NamedNode[] }, ids?: (string | NamedNode)[]): T[];
  }

  interface Response {
    graph(dataset: DatasetCore | Stream): void;
    representation(resource: RdfResource): void;
  }
}
