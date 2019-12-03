import { Hydra } from 'alcaeus'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { HydraResource, Collection, IOperation } from 'alcaeus/types/Resources'
import { Project, ResourceId, Table, Attribute, Source, TableFormData, AttributeFormData } from '@/types'
import { getOperation } from './common'
import * as URI from './uris'
import * as ProjectMixin from './resources/project'
import * as SourceMixin from './resources/source'
import * as TableMixin from './resources/table'
import * as ColumnMixin from './resources/column'
import * as AttributeMixin from './resources/attribute'

const apiURL = process.env.VUE_APP_API_URL

const rdf = Hydra.mediaTypeProcessors.RDF as any
rdf.resourceFactory.mixins.push(ProjectMixin)
rdf.resourceFactory.mixins.push(SourceMixin)
rdf.resourceFactory.mixins.push(TableMixin)
rdf.resourceFactory.mixins.push(ColumnMixin)
rdf.resourceFactory.mixins.push(AttributeMixin)

export class APIError extends Error {
  details: any;
  response: IHydraResponse;

  constructor (details: any, response: IHydraResponse) {
    const message = details.title || 'Unkown error'

    super(message)

    this.details = details
    this.response = response
  }

  static async fromResponse (response: IHydraResponse): Promise<APIError> {
    let details
    try {
      details = await response.xhr.json()
    } catch (e) {
      details = {}
    }

    return new APIError(details, response)
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

  async entrypoint (): Promise<HydraResource> {
    if (!this.cachedEntrypoint) {
      this.cachedEntrypoint = await loadResource(this.url)
    }

    return this.cachedEntrypoint
  }
}

// TODO: Can we generate this from API description somehow?
class ProjectsClient {
  api: Client;

  constructor (api: Client) {
    this.api = api
  }

  async projectsCollection (): Promise<Collection | null> {
    const entrypoint = await this.api.entrypoint()
    return entrypoint.get<Collection>(URI.API_PROJECTS)
  }

  async list () {
    const projectsCollection = await this.projectsCollection()

    if (!projectsCollection) throw new Error('No projects collection on entrypoint')

    const loadedCollection = await loadResource<Collection>(projectsCollection.id)
    return loadedCollection.members
  }

  async create (name: string): Promise<Project> {
    const projectsCollection = await this.projectsCollection()

    if (!projectsCollection) throw new Error('No projects collection on entrypoint')

    const operation = getOperation(projectsCollection, URI.OP_PROJECTS_CREATE)
    const data = {
      '@type': URI.TYPE_PROJECT,
      [URI.PROP_NAME]: name
    }
    return invokeCreateOperation<Project>(operation, data)
  }

  async delete (project: Project): Promise<void> {
    return invokeDeleteOperation(project.actions.delete)
  }

  async get (id: string) {
    return loadResource(id)
  }

  async getTables (project: any) {
    const collection = await loadResource<Collection>(project.tablesCollection.id)
    const incompleteTables = collection.members

    const tables = Promise.all(incompleteTables.map(async (incompleteTable: any) =>
      loadResource(incompleteTable.id)
    ))

    return tables
  }

  async createTable (project: Project, tableData: TableFormData): Promise<Table> {
    if (tableData.type === 'fact') {
      return this.createFactTable(project, tableData)
    } else {
      return this.createDimensionTable(project, tableData)
    }
  }

  async createTableWithAttributes (project: Project, tableData: TableFormData, attributes: AttributeFormData[]): Promise<Table> {
    const table = await this.createTable(project, tableData)
    const attributesIds = await Promise.all(attributes.map((attribute) => this.createAttribute(table, attribute)))
    return table
  }

  async createDimensionTable (project: Project, tableData: TableFormData): Promise<Table> {
    const operation = project.actions.createFactTable
    const data = {
      '@type': URI.TYPE_DIMENSION_TABLE,
      [URI.PROP_NAME]: tableData.name,
      [URI.PROP_SOURCE]: tableData.sourceId,
      [URI.PROP_IDENTIFIER_TEMPLATE]: tableData.identifierTemplate
    }
    return invokeCreateOperation<Table>(operation, data)
  }

  async createFactTable (project: Project, tableData: TableFormData): Promise<Table> {
    const operation = project.actions.createDimensionTable
    const data = {
      '@type': URI.TYPE_FACT_TABLE,
      [URI.PROP_NAME]: tableData.name,
      [URI.PROP_SOURCE]: tableData.sourceId
    }
    return invokeCreateOperation<Table>(operation, data)
  }

  async deleteTable (table: Table): Promise<void> {
    return invokeDeleteOperation(table.actions.delete)
  }

  async createSource (project: any, file: File): Promise<Source> {
    const operation = project.actions.createSource
    const headers = {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${file.name}"`
    }
    return invokeCreateOperation<Source>(operation, file, headers)
  }

  async getSources (project: any) {
    const sourcesCollection = await loadResource<Collection>(project.sourcesCollection.id)
    const incompleteSources = sourcesCollection.members

    const sources = Promise.all(incompleteSources.map(async (incompleteSource: any) =>
      loadResource(incompleteSource.id)
    ))

    return sources
  }

  async getSourceSampleData (source: any) {
    const loadedCollection = await loadResource<Collection>(source.sampleCollection.id)
    const rows = loadedCollection.members.map((row: HydraResource) => {
      return row[URI.API_CELLS]
    })

    return rows
  }

  async getAttributes (table: any) {
    const collection = await loadResource<Collection>(table.attributesCollection.id)
    return collection.members
  }

  async createAttribute (table: any, attributeData: AttributeFormData): Promise<Attribute> {
    const operation = table.actions.createAttribute
    const data = {
      '@type': URI.TYPE_ATTRIBUTE,
      [URI.PROP_PREDICATE]: attributeData.predicateId,
      [URI.PROP_COLUMN]: attributeData.columnId,
      [URI.PROP_DATATYPE]: attributeData.dataTypeId,
      [URI.PROP_LANGUAGE]: attributeData.language
    }
    return invokeCreateOperation<Attribute>(operation, data)
  }
}

async function loadResource<T extends HydraResource = HydraResource> (id: ResourceId): Promise<T> {
  const response = await Hydra.loadResource(id)

  if (response.xhr.status !== 200) {
    throw await APIError.fromResponse(response)
  }

  const resource = response.root
  if (!resource) {
    throw new Error('Response does not contain created resource')
  }

  return resource as T
}

async function invokeCreateOperation<T extends HydraResource = HydraResource> (operation: IOperation, data: Record<string, any> | File, headers: Record<string, any> = {}): Promise<T> {
  const serializedData = data instanceof File ? data : JSON.stringify(data)

  const response = await operation.invoke(serializedData, headers)
  if (response.xhr.status !== 201) {
    throw await APIError.fromResponse(response)
  }

  const resource = response.root
  if (!resource) {
    throw new Error('Response does not contain created resource')
  }

  return resource as T
}

async function invokeDeleteOperation (operation: IOperation): Promise<void> {
  const response = await operation.invoke('')

  if (response.xhr.status !== 204) {
    throw await APIError.fromResponse(response)
  }
}

export const client = new Client(apiURL)
