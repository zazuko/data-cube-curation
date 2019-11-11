import { Hydra } from 'alcaeus'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { HydraResource, Collection, IOperation } from 'alcaeus/types/Resources'
import { expand, prefixes } from '@zazuko/rdf-vocabularies'
import { Project, ResourceId, Table, RemoteData } from './types'
import { getColor } from './colors'

prefixes.dataCube = 'https://rdf-cube-curation.described.at/'

const apiURL = process.env.VUE_APP_API_URL

const TYPE_PROJECT = expand('dataCube:Project')
const TYPE_SOURCE = expand('dataCube:Source')
const TYPE_FACT_TABLE = expand('dataCube:FactTable')
const TYPE_DIMENSION_TABLE = expand('dataCube:DimensionTable')
const TYPE_TABLE = expand('dataCube:Table')

const PROP_NAME = expand('schema:name')
const PROP_SOURCE = expand('dataCube:source')
const PROP_IDENTIFIER_TEMPLATE = expand('dataCube:identifierTemplate')

const API_PROJECTS = expand('dataCube:api/projects')
const API_SOURCES = expand('dataCube:api/sources')
const API_TABLES = expand('dataCube:api/tables')
const OP_PROJECTS_GET = expand('dataCube:api/GetDataCubeProjects')
const OP_PROJECTS_CREATE = expand('dataCube:api/CreateProject')
const OP_PROJECT_DELETE = expand('dataCube:api/DeleteProject')
const OP_PROJECT_EDIT = expand('dataCube:api/ReplaceProject')
const OP_SOURCES_CREATE = expand('dataCube:api/AddSource')
const OP_TABLES_GET = expand('dataCube:api/GetTables')
const OP_TABLES_CREATE_DIMENSION = expand('dataCube:api/CreateDimensionTable')
const OP_TABLES_CREATE_FACT = expand('dataCube:api/PostFactTable')
const OP_TABLE_GET = expand('dataCube:api/GetTable')
const OP_TABLE_EDIT = expand('dataCube:api/EditTable')
const OP_TABLE_DELETE = expand('dataCube:api/DeleteTable')

type Constructor<T = {}> = new (...args: any[]) => HydraResource;

const ProjectMixin = {
  Mixin<B extends Constructor> (Base: B) {
    return class extends Base {
      tables: RemoteData<Table[]> = { isLoading: true, data: null, error: null }

      get actions () {
        return {
          delete: findOperation(this, OP_PROJECT_DELETE),
          edit: findOperation(this, OP_PROJECT_EDIT),
          createSource: this.sourcesCollection && findOperation(this.sourcesCollection, OP_SOURCES_CREATE),
          getTables: this.tablesCollection && findOperation(this.tablesCollection, OP_TABLES_GET),
          createDimensionTable: this.tablesCollection && findOperation(this.tablesCollection, OP_TABLES_CREATE_DIMENSION),
          createFactTable: this.tablesCollection && findOperation(this.tablesCollection, OP_TABLES_CREATE_FACT)
        }
      }

      get name () {
        return this.get(PROP_NAME)
      }

      get sourcesCollection () {
        return this.get<Collection>(API_SOURCES)
      }

      get sources () {
        if (!this.sourcesCollection) return []

        return this.sourcesCollection.members
      }

      get tablesCollection () {
        return this.get<Collection>(API_TABLES)
      }
    }
  },

  shouldApply (resource: HydraResource) {
    return resource.types.contains(TYPE_PROJECT)
  }
}

const SourceMixin = {
  Mixin<B extends Constructor> (Base: B) {
    return class extends Base {
      get name () {
        return this.get(PROP_NAME)
      }
    }
  },

  shouldApply (resource: HydraResource) {
    return resource.types.contains(TYPE_SOURCE)
  }
}

const TableMixin = {
  Mixin<B extends Constructor> (Base: B) {
    return class extends Base {
      attributes = [];

      constructor (...args: any[]) {
        super(...args)

        this.color = getColor(this.id)
      }

      get actions () {
        return {
          delete: findOperation(this, OP_TABLE_DELETE),
          edit: findOperation(this, OP_TABLE_EDIT)
        }
      }

      get name () {
        return this.get(PROP_NAME)
      }

      get identifierTemplate () {
        return this.get(PROP_IDENTIFIER_TEMPLATE)
      }

      get isFact () {
        return this.types.includes(TYPE_FACT_TABLE)
      }
    }
  },

  shouldApply (resource: HydraResource) {
    return resource.types.contains(TYPE_TABLE)
  }
}

const rdf = Hydra.mediaTypeProcessors.RDF as any
rdf.resourceFactory.mixins.push(ProjectMixin)
rdf.resourceFactory.mixins.push(SourceMixin)
rdf.resourceFactory.mixins.push(TableMixin)

export class APIError extends Error {
  details: any;
  response: IHydraResponse;

  constructor (details: any, response: IHydraResponse) {
    const message = details.title || 'Unkown error'

    super(message)

    this.details = details
    this.response = response
  }
}

export class Client {
  url: string;
  projects: ProjectsClient;
  cachedEntrypoint: HydraResource;

  constructor (url: string) {
    this.url = url

    this.projects = new ProjectsClient(this)
  }

  async entrypoint () {
    if (!this.cachedEntrypoint) {
      const response = await Hydra.loadResource(this.url)
      this.cachedEntrypoint = getOrThrow(response, 'root')
    }

    return this.cachedEntrypoint
  }
}

// TODO: Can we generate this from API description somehow?
class ProjectsClient {
  api: Client;
  cachedResource: HydraResource;

  constructor (api: Client) {
    this.api = api
  }

  async resource () {
    if (!this.cachedResource) {
      const entrypoint = await this.api.entrypoint()
      this.cachedResource = getOrThrow(entrypoint, API_PROJECTS)
    }

    return this.cachedResource
  }

  async list () {
    const resource = await this.resource()
    const operation = getOperation(resource, OP_PROJECTS_GET)
    const response = await operation.invoke('')
    const projectsCollection = getOrThrow(response, 'root') as Collection

    return projectsCollection.members || []
  }

  async create (name: string): Promise<ResourceId> {
    const resource = await this.resource()
    const operation = getOperation(resource, OP_PROJECTS_CREATE)
    const data = {
      '@type': TYPE_PROJECT,
      [PROP_NAME]: name
    }
    return invokeCreateOperation(operation, data)
  }

  async delete (project: any): Promise<void> {
    const response = await project.actions.delete.invoke()

    if (response.xhr.status !== 204) {
      const details = await response.xhr.json()
      throw new APIError(details, response)
    }
  }

  async get (id: string) {
    const response = await Hydra.loadResource(id)
    return getOrThrow(response, 'root')
  }

  async createSource (project: any, file: File) {
    const operation = project.actions.createSource
    const headers = {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${file.name}"`
    }
    await operation.invoke(file, headers)
  }

  async getTables (project: any) {
    const operation = project.actions.getTables
    const response = await operation.invoke(operation)
    const collection = getOrThrow(response, 'root') as Collection

    return collection.members
  }

  async createTable (project: Project, table: Table): Promise<string> {
    if (table.type === 'fact') {
      return this.createFactTable(project, table)
    } else {
      return this.createDimensionTable(project, table)
    }
  }

  async createDimensionTable (project: Project, table: Table): Promise<ResourceId> {
    const operation = project.actions.createFactTable
    const data = {
      '@type': TYPE_DIMENSION_TABLE,
      [PROP_NAME]: table.name,
      [PROP_SOURCE]: table.sourceId,
      [PROP_IDENTIFIER_TEMPLATE]: table.identifierTemplate
    }
    return invokeCreateOperation(operation, data)
  }

  async createFactTable (project: Project, table: Table): Promise<ResourceId> {
    const operation = project.actions.createDimensionTable
    const data = {
      '@type': TYPE_FACT_TABLE,
      [PROP_NAME]: table.name,
      [PROP_SOURCE]: table.sourceId
    }
    return invokeCreateOperation(operation, data)
  }
}

async function invokeCreateOperation (operation: IOperation, data: Record<string, any>): Promise<ResourceId> {
  const response = await operation.invoke(JSON.stringify(data))
  const id = response.xhr.headers.get('Location')

  if (response.xhr.status !== 201 || !id) {
    const details = await response.xhr.json()
    throw new APIError(details, response)
  }

  return id
}

function getOrThrow (obj: any, prop: string) {
  const value = obj[prop]

  if (!prop) {
    throw new Error(`No ${prop} found in ${obj}`)
  }

  return value
}

function findOperation (resource: HydraResource, operationId: string) {
  return resource.operations.find((op: IOperation) => op.supportedOperation.id === operationId) || null
}

function getOperation (resource: HydraResource, operationId: string) {
  const operation = findOperation(resource, operationId)

  if (!operation) {
    throw new Error(`Operation ${operationId} not found on ${resource.id}`)
  }

  return operation
}

export const client = new Client(apiURL)
