import { Entity, AggregateRoot, Repository, AR } from './index'
import SparqlHttp from 'sparql-http-client'
import ParserJsonld from '@rdfjs/parser-jsonld'
import SerializerJsonld from '@rdfjs/serializer-jsonld'
import { promises } from 'jsonld'
import stringToStream from 'string-to-stream'
import rdf from 'rdf-ext'
import { expand } from '@zazuko/rdf-vocabularies'

const parserJsonld = new ParserJsonld()
const serializerJsonld = new SerializerJsonld()

export class SparqlRepository<S extends Entity> implements Repository<S> {
  private readonly __sparql: SparqlHttp
  private readonly __base: string
  private readonly __context: object
  private readonly __frame: object

  public constructor (sparql: SparqlHttp, base: string, context: object, frame: object) {
    this.__sparql = sparql
    this.__base = base
    this.__context = context
    this.__frame = frame
  }

  public async save (state: S, version: number): Promise<void> {
    const id = state['@id']
    const jsonld = {
      '@context': {
        ...this.__context,
        '@base': this.__base,
      },
      ...state,
    }

    const parsed = await rdf.dataset().import(parserJsonld.import(stringToStream(JSON.stringify(jsonld))))

    const response = await this.__sparql.updateQuery(`
      BASE <${this.__base}>

      CLEAR GRAPH <${id}>;
      DELETE
      {
        <${id}> <urn:ar:version> ?version
      }
      INSERT
      {
        GRAPH <${id}> {
          ${parsed.toString()}
        }
        <${id}> <urn:ar:version> ${version} .
      }
      WHERE
      {
        OPTIONAL { <${id}> <urn:ar:version> ?version }
      }
    `)

    if (!response.ok) {
      throw new Error(`Failed to save aggregate root: '${response.statusText}'`)
    }
  }

  public async load (id: string): Promise<AggregateRoot<S> | null> {
    const graph = await this.__sparql.constructQuery(`
    BASE <${this.__base}>
    
    CONSTRUCT { 
      ?s ?p ?o .
      <${id}> <urn:ar:version> ?version .
     } 
    WHERE { 
      GRAPH <${id}> { ?s ?p ?o }
      <${id}> <urn:ar:version> ?version 
    }`)

    const stream = await serializerJsonld.import(await graph.quadStream())

    const jsonldArray = await new Promise((resolve) => {
      stream.on('data', jsonld => {
        resolve(jsonld)
      })
    })

    const jsonld = await promises.frame(jsonldArray, {
      '@context': {
        ...this.__context,
        '@base': this.__base,
        'urn:ar:version': { '@type': expand('xsd:integer') },
      },
      ...this.__frame,
    })

    const state = jsonld['@graph'][0]

    if (state) {
      return new AR<S>(state, Number.parseInt(state['urn:ar:version']))
    }

    return null
  }
}
