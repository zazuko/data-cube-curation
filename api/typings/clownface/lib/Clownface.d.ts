declare module 'clownface/lib/Clownface' {
  import { BlankNode, DatasetCore, Literal, NamedNode, Term } from 'rdf-js'
  import {
    Clownface as ClownfaceContract,
    ClownfaceInit,
    AddCallback,
    NodeOptions,
    SafeClownface,
    SingleOrArray,
    SingleOrArrayOfTerms,
    SingleOrArrayOfTermsOrLiterals,
    WithValue,
    WithTerm,
  } from 'clownface'

  class Clownface<D extends DatasetCore = DatasetCore, T extends Term = Term> implements ClownfaceContract<D, T> {
    public constructor(options: ClownfaceInit & Partial<WithTerm> & Partial<WithValue>);

    public readonly term: T | undefined;
    public readonly terms: T[];
    public readonly value: string | undefined;
    public readonly values: string[];
    public readonly dataset: D;
    public readonly datasets: D[];
    public readonly _context: any;

    public list(): Iterator<Term>;

    public toArray(): Clownface<D, T>[];

    public filter(cb: (quad: Clownface<D, T>) => boolean): Clownface<D, T>;
    public forEach(cb: (quad: Clownface<D, T>) => void): void;

    public toString(): string;

    public map<X>(cb: (quad: Clownface<D, T>, index: number) => X): X[];

    public node<X extends Term = Term>(values: SingleOrArray<boolean | string | number | Term | null>, options?: NodeOptions): SafeClownface<D, X>;

    public blankNode(values?: SingleOrArray<string>): SafeClownface<D, BlankNode>;

    public literal(values: SingleOrArray<boolean | string | number | Term | null>, languageOrDatatype?: string | NamedNode): SafeClownface<D, Literal>;

    public namedNode(values: SingleOrArray<string | NamedNode>): SafeClownface<D, NamedNode>;

    public in<X extends Term = Term>(predicates: SingleOrArrayOfTerms): SafeClownface<D, X>;

    public out<X extends Term = Term>(predicates: SingleOrArrayOfTerms): SafeClownface<D, X>;

    public has<X extends Term = Term>(predicates: SingleOrArrayOfTerms, objects?: SingleOrArrayOfTermsOrLiterals): SafeClownface<D, X>;

    public addIn<X extends Term = Term>(predicates: SingleOrArrayOfTerms, objectsOrCallback?: SingleOrArrayOfTermsOrLiterals | AddCallback<D, X>): SafeClownface<D, X>;
    // eslint-disable-next-line no-dupe-class-members
    public addIn<X extends Term = Term>(predicates: SingleOrArrayOfTerms, objects: SingleOrArrayOfTermsOrLiterals, callback: AddCallback<D, X>): SafeClownface<D, X>;

    public addOut<X extends Term = Term>(predicates: SingleOrArrayOfTerms, objectsOrCallback?: SingleOrArrayOfTermsOrLiterals | AddCallback<D, X>): SafeClownface<D, X>;
    // eslint-disable-next-line no-dupe-class-members
    public addOut<X extends Term = Term>(predicates: SingleOrArrayOfTerms, objects: SingleOrArrayOfTermsOrLiterals, callback: AddCallback<D, X>): SafeClownface<D, X>;

    public addList<X extends Term = Term>(predicates: SingleOrArrayOfTerms, objects?: SingleOrArrayOfTermsOrLiterals, callback?: AddCallback<D, X>): SafeClownface<D, X>;

    public deleteIn<X extends Term = Term>(predicates?: SingleOrArrayOfTerms): SafeClownface<D, X>;

    public deleteOut<X extends Term = Term>(predicates?: SingleOrArrayOfTerms): SafeClownface<D, X>;

    public deleteList<X extends Term = Term>(predicates: SingleOrArrayOfTerms): SafeClownface<D, X>;
  }

  export = Clownface
}
