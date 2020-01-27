import namespace from '@rdfjs/namespace'
import { prefixes } from '@zazuko/rdf-vocabularies'

prefixes.dataCube = 'https://rdf-cube-curation.described.at/'

export const rdf = namespace(prefixes.rdf)
export const schema = namespace(prefixes.schema)
export const api = namespace('https://rdf-cube-curation.described.at/api/')
export const dataCube = namespace('https://rdf-cube-curation.described.at/')
export const datatype = namespace('https://rdf-cube-curation.described.at/datatype/')
