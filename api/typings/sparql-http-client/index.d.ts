declare module 'sparql-http-client' {
  interface SparqlHttp {
    updateQuery(query: string, options?: unknown): Promise<unknown>;
    selectQuery(query: string, options?: unknown): Promise<unknown>;
    constructQuery(query: string, options?: unknown): Promise<unknown>;
  }
}
