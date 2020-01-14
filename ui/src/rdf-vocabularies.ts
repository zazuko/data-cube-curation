import rdf from 'rdf-ext'
import { Quad } from 'rdf-js'
import { vocabularies, prefixes, expand as rdfExpand, shrink as rdfShrink } from '@zazuko/rdf-vocabularies'

const relevantPrefixes = ['rdfs', 'schema', 'qb', 'sdmx', 'dcterms', 'dc11', 'skos', 'skosxl', 'xkos', 'xsd', 'wgs']

const PROPERTY = rdf.namedNode(rdfExpand('rdf:Property'))
const TYPE = rdf.namedNode(rdfExpand('rdf:type'))

export async function loadRDFProperties (): Promise<string[]> {
  const vocabs = await vocabularies({ only: relevantPrefixes })

  return Object.entries(vocabs).flatMap(([prefix, dataset]) => {
    const baseIRI = prefixes[prefix]
    const graph = rdf.namedNode(baseIRI)
    const properties = dataset.match(null, TYPE, PROPERTY, graph)

    return properties.toArray().map((property: Quad) => shrink(property.subject.value))
  })
}

export function expand (uri: string): string {
  if (uri && !uri.includes(':')) return uri

  if (uri.startsWith('http://')) return uri

  try {
    return rdfExpand(uri)
  } catch {
    return uri
  }
}

export function expandWithBase (uri: string, baseUri: string): string {
  if (uri && !uri.includes(':')) return `${baseUri}${uri}`

  return expand(uri)
}

export function shrink (uri: string): string {
  const shrinked = rdfShrink(uri)

  return shrinked || uri
}
