declare module 'clownface/lib/Clownface' {
  import { BaseQuad, Term, BlankNode, NamedNode, Literal } from 'rdf-js'

  type TermOrClownface = Clownface | Term;
  type TermOrLiteral = TermOrClownface | string | number | boolean;

  type AddCallback<X> = (added: Clownface<X>) => void;
  type SingleOrArray<T> = T | T[]

  type SingleOrArrayOfTerms = SingleOrArray<TermOrClownface>
  type SingleOrArrayOfTermsOrLiterals = SingleOrArray<TermOrLiteral>

  interface Clownface<T = Term> {
    term: T | null;
    terms: T[];
    value: string | null;
    values: string[];
    dataset: any;
    datasets: any[];
    list: Iterator<Term>;
    toArray(): Clownface<T>[];
    filter(cb: (quad: BaseQuad) => boolean);
    forEach(cb: (quad: BaseQuad) => void);
    map<X = Term>(cb: (quad: Clownface<T>) => X);
    toString(): string;
    node<X = Term> (values, { type, datatype, language }?): Clownface<X>;
    blankNode (values?): Clownface<BlankNode>;
    literal (values, languageOrDatatype?: string): Clownface<Literal>;
    namedNode (values): Clownface<NamedNode>;
    in<X = Term> (predicates: SingleOrArrayOfTerms): Clownface<X>;
    out<X = Term> (predicates: SingleOrArrayOfTerms): Clownface<X>;

    has<X = Term> (predicates: SingleOrArrayOfTerms): Clownface<X>;
    has<X = Term> (predicates: SingleOrArrayOfTerms, objects: SingleOrArrayOfTermsOrLiterals): Clownface<X>;

    addIn<X = Term> (predicates: SingleOrArrayOfTerms): Clownface<X>;
    addIn<X = Term> (predicates: SingleOrArrayOfTerms, objectsOrCallback: SingleOrArrayOfTermsOrLiterals | AddCallback<X>): Clownface<X>;
    addIn<X = Term> (predicates: SingleOrArrayOfTerms, objects: SingleOrArrayOfTermsOrLiterals, callback: AddCallback<X>): Clownface<X>;

    addOut<X = Term> (predicates: SingleOrArrayOfTerms): Clownface<X>;
    addOut<X = Term> (predicates: SingleOrArrayOfTerms, objectsOrCallback: SingleOrArrayOfTermsOrLiterals | AddCallback<X>): Clownface<X>;
    addOut<X = Term> (predicates: SingleOrArrayOfTerms, objects: SingleOrArrayOfTermsOrLiterals, callback: AddCallback<X>): Clownface<X>;

    addList<X = Term> (predicates: SingleOrArrayOfTerms, objects?, callback?: AddCallback<X>): Clownface<X>;

    deleteIn<X = Term> (predicates: SingleOrArrayOfTerms): Clownface<X>;
    deleteOut<X = Term> (predicates: SingleOrArrayOfTerms): Clownface<X>;
    deleteList<X = Term> (predicates: SingleOrArrayOfTerms): Clownface<X>;
  }

  class Clownface<T = Term> implements Clownface<T> {}

  export = Clownface
}
