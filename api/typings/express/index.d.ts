import { Constructor, RdfResource } from '@tpluscode/rdfine'
import { NamedNode, DatasetCore, Stream } from 'rdf-js'
import { Mixin } from '@tpluscode/rdfine/lib/ResourceFactory'
import DatasetExt = require('rdf-ext/lib/Dataset')

declare module 'express' {

  interface Request {
    graph: DatasetExt;
    resourceId: string;
    resourceNode: NamedNode;
    resourcePath: string;
    buildModel <T extends RdfResource> (mixins: Mixin<any>[], ids?: (string | NamedNode)[]): T[];
    buildModel <T extends RdfResource> (Class: Constructor<T> & { types?: NamedNode[] }, ids?: (string | NamedNode)[]): T[];
  }

  interface Response {
    graph(dataset: DatasetCore | Stream): void;
    representation(resource: RdfResource): void;
  }
}
