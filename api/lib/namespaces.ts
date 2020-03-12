import namespace from '@rdfjs/namespace'
import { prefixes } from '@zazuko/rdf-vocabularies'

prefixes.dataCube = 'https://rdf-cube-curation.described.at/'

export const rdf = namespace(prefixes.rdf)
export const rdfs = namespace(prefixes.rdfs)
export const hydra = namespace(prefixes.hydra)
export const csvw = namespace(prefixes.csvw)
export const xsd = namespace(prefixes.xsd)
export const schema = namespace(prefixes.schema)
export const dtype = namespace(prefixes.dtype)
export const qb = namespace(prefixes.qb)
export const api = namespace('https://rdf-cube-curation.described.at/api/')
export const dataCube = namespace('https://rdf-cube-curation.described.at/')
export const datatype = namespace('https://rdf-cube-curation.described.at/datatype/')
