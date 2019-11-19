import { expand, prefixes } from '@zazuko/rdf-vocabularies'

prefixes.dataCube = 'https://rdf-cube-curation.described.at/'

export const TYPE_PROJECT = expand('dataCube:Project')
export const TYPE_SOURCE = expand('dataCube:Source')
export const TYPE_FACT_TABLE = expand('dataCube:FactTable')
export const TYPE_DIMENSION_TABLE = expand('dataCube:DimensionTable')
export const TYPE_TABLE = expand('dataCube:Table')
export const TYPE_COLUMN = expand('dataCube:Column')
export const TYPE_ATTRIBUTE = expand('dataCube:Attribute')

export const TYPE_OP_VIEW = expand('schema:ViewAction')
export const TYPE_OP_DELETE = expand('schema:DeleteAction')

export const PROP_NAME = expand('schema:name')
export const PROP_SOURCE = expand('dataCube:source')
export const PROP_IDENTIFIER_TEMPLATE = expand('dataCube:identifierTemplate')
export const PROP_PREDICATE = expand('rdf:predicate')
export const PROP_COLUMN = expand('dataCube:column')
export const PROP_DATATYPE = expand('dataCube:datatype')
export const PROP_LANGUAGE = expand('dataCube:language')
export const PROP_TABLE = expand('dataCube:table')

export const API_PROJECTS = expand('dataCube:api/projects')
export const API_SOURCES = expand('dataCube:api/sources')
export const API_TABLES = expand('dataCube:api/tables')
export const API_SOURCE_COLUMNS = expand('dataCube:api/columns')
export const API_SOURCE_SAMPLE = expand('dataCube:api/sample')
export const API_CELLS = expand('dataCube:api/cells')
export const API_ATTRIBUTES = expand('dataCube:api/attributes')

export const OP_PROJECTS_CREATE = expand('dataCube:api/CreateProject')
export const OP_PROJECT_DELETE = expand('dataCube:api/DeleteProject')
export const OP_PROJECT_EDIT = expand('dataCube:api/ReplaceProject')
export const OP_SOURCES_CREATE = expand('dataCube:api/AddSource')
export const OP_SOURCE_DELETE = expand('dataCube:api/DeleteSource')
export const OP_TABLES_CREATE_DIMENSION = expand('dataCube:api/CreateDimensionTable')
export const OP_TABLES_CREATE_FACT = expand('dataCube:api/PostFactTable')
export const OP_TABLE_EDIT = expand('dataCube:api/EditTable')
export const OP_TABLE_DELETE = expand('dataCube:api/DeleteTable')
export const OP_ATTRIBUTES_CREATE = expand('dataCube:api/AddAttributeMappedFromSingleColumn')
export const OP_ATTRIBUTE_DELETE = expand('dataCube:api/DeleteAttribute')
export const OP_ATTRIBUTE_EDIT = expand('dataCube:api/EditAttribute')
