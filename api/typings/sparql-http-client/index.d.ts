declare module 'sparql-http-client' {
  interface SparqlHttpOptions {
    endpointUrl: string;
    updateUrl: string;
    fetch: any;
  }

  export default class SparqlHttp {
    public constructor (options: SparqlHttpOptions);
    public updateQuery(query: string, options?: unknown): Promise<Response>;
    public selectQuery(query: string, options?: unknown): Promise<any>;
    public constructQuery(query: string, options?: unknown): Promise<any>;
  }
}
