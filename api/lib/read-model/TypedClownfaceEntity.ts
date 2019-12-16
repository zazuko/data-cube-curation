import { Term, NamedNode } from 'rdf-js'
import Clownface from 'clownface/lib/Clownface'
import { rdf } from '../namespaces'

export interface TypedClownfaceEntity {
  readonly id: Term;
  readonly types: Term[];
  hasType (type: string | NamedNode): boolean;
}

export default class extends Clownface implements TypedClownfaceEntity {
  public get id () {
    return this.term
  }

  public get types () {
    return this.out(rdf.type).terms
  }

  public hasType (type: string | NamedNode) {
    const typeNode = typeof type === 'string' ? this.namedNode(type) : type

    return this.has(rdf.type, typeNode).terms.length > 0
  }
}
