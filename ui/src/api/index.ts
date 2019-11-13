import { Hydra } from 'alcaeus'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { HydraResource, Collection, IOperation, IPartialCollectionView } from 'alcaeus/types/Resources'
import { Project, ResourceId, Table } from '../types'
import { findOperation, getOperation, getOperationByType } from './common'
import * as URI from './uris'
import * as ProjectMixin from './resources/project'
import * as SourceMixin from './resources/source'
import * as TableMixin from './resources/table'
import * as ColumnMixin from './resources/column'

const apiURL = process.env.VUE_APP_API_URL

const rdf = Hydra.mediaTypeProcessors.RDF as any
rdf.resourceFactory.mixins.push(ProjectMixin)
rdf.resourceFactory.mixins.push(SourceMixin)
rdf.resourceFactory.mixins.push(TableMixin)
rdf.resourceFactory.mixins.push(ColumnMixin)

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
      this.cachedResource = getOrThrow(entrypoint, URI.API_PROJECTS)
    }

    return this.cachedResource
  }

  async list () {
    const resource = await this.resource()
    const operation = getOperation(resource, URI.OP_PROJECTS_GET)
    const response = await operation.invoke('')
    const projectsCollection = getOrThrow(response, 'root') as Collection

    return projectsCollection.members || []
  }

  async create (name: string): Promise<ResourceId> {
    const resource = await this.resource()
    const operation = getOperation(resource, URI.OP_PROJECTS_CREATE)
    const data = {
      '@type': URI.TYPE_PROJECT,
      [URI.PROP_NAME]: name
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
      '@type': URI.TYPE_DIMENSION_TABLE,
      [URI.PROP_NAME]: table.name,
      [URI.PROP_SOURCE]: table.sourceId,
      [URI.PROP_IDENTIFIER_TEMPLATE]: table.identifierTemplate
    }
    return invokeCreateOperation(operation, data)
  }

  async createFactTable (project: Project, table: Table): Promise<ResourceId> {
    const operation = project.actions.createDimensionTable
    const data = {
      '@type': URI.TYPE_FACT_TABLE,
      [URI.PROP_NAME]: table.name,
      [URI.PROP_SOURCE]: table.sourceId
    }
    return invokeCreateOperation(operation, data)
  }

  async createSource (project: any, file: File) {
    const operation = project.actions.createSource
    const headers = {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${file.name}"`
    }
    return invokeCreateOperation(operation, file, headers)
  }

  async getSources (project: any) {
    const response = await Hydra.loadResource(project.sourcesCollection.id) // No GET operation on the collection
    const sourcesCollection = getOrThrow(response, 'root') as Collection
    const incompleteSources = sourcesCollection.members

    const sources = Promise.all(incompleteSources.map(async (incompleteSource: any) => {
      const operation = getOperation(incompleteSource, URI.OP_SOURCE_GET)
      const response = await operation.invoke('')
      return getOrThrow(response, 'root')
    }))

    return sources
  }

  async getSourceSampleData (source: any) {
    const collection = source.sampleCollection
    const operation = getOperationByType(collection, URI.TYPE_OP_VIEW)
    const response = await operation.invoke('')
    const loadedCollection = getOrThrow(response, 'root')
    const rows = loadedCollection.members.map((row: HydraResource) => {
      return row[URI.API_CELLS]
    })

    return rows
  }
}

async function invokeCreateOperation (operation: IOperation, data: Record<string, any> | File, headers: Record<string, any> = {}): Promise<ResourceId> {
  const serializedData = data instanceof File ? data : JSON.stringify(data)

  const response = await operation.invoke(serializedData, headers)
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

export const client = new Client(apiURL)
