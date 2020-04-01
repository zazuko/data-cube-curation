import namespace from '@rdfjs/namespace'
import { prefixes } from '@zazuko/rdf-vocabularies'

prefixes.api = 'https://rdf-cube-curation.described.at/api/'
prefixes.datatype = 'https://rdf-cube-curation.described.at/datatype/'
prefixes.dataCube = 'https://rdf-cube-curation.described.at/'

export const api = namespace(prefixes.api)
export const dataCube = namespace(prefixes.dataCube)
export const datatype = namespace(prefixes.datatype)
