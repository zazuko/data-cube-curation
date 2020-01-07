import { Hydra } from 'alcaeus'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { HydraResource, Collection, IOperation } from 'alcaeus/types/Resources'
import { Project, ProjectFormData, ResourceId, Table, Source, TableFormData, Attribute, ValueAttribute, ValueAttributeFormData, ReferenceAttribute, ReferenceAttributeFormData } from '@/types'
import { getOperation, findOperation } from './common'
import * as URI from './uris'
import * as ProjectMixin from './resources/project'
import * as SourceMixin from './resources/source'
import * as TableMixin from './resources/table'
import * as ColumnMixin from './resources/column'
import * as ValueAttributeMixin from './resources/value-attribute'
import * as ReferenceAttributeMixin from './resources/reference-attribute'

const apiURL = process.env.VUE_APP_API_URL

if (!apiURL) throw new Error('Missing `VUE_APP_API_URL` setting')

const rdf = Hydra.mediaTypeProcessors.RDF as any
rdf.resourceFactory.mixins.push(ProjectMixin)
rdf.resourceFactory.mixins.push(SourceMixin)
rdf.resourceFactory.mixins.push(TableMixin)
rdf.resourceFactory.mixins.push(ColumnMixin)
rdf.resourceFactory.mixins.push(ValueAttributeMixin)
rdf.resourceFactory.mixins.push(ReferenceAttributeMixin)

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

  async actions () {
    const projectsCollection = await this.projectsCollection()

    return {
      create: projectsCollection && findOperation(projectsCollection, URI.OP_PROJECTS_CREATE)
    }
  }

  async list () {
    const projectsCollection = await this.projectsCollection()

    if (!projectsCollection) throw new Error('No projects collection on entrypoint')

    const loadedCollection = await loadResource<Collection>(projectsCollection.id)
    return loadedCollection.members
  }

  async save (operation: IOperation, project: ProjectFormData) {
    const data = {
      [URI.PROP_NAME]: project.name,
      [URI.PROP_BASE_URI]: project.baseUri
    }
    return invokeSaveOperation<Project>(operation, data)
  }

  async delete (project: Project): Promise<void> {
    return invokeDeleteOperation(project.actions.delete)
  }

  async get (id: string) {
    return loadResource(id)
  }

  async getTables (project: Project): Promise<Table[]> {
    if (!project.tablesCollection) throw new Error('Project has no tables collection')

    const collection = await loadResource<Collection>(project.tablesCollection.id)
    const incompleteTables = collection.members

    const tables = Promise.all(incompleteTables.map(async (incompleteTable: HydraResource) =>
      loadResource<Table>(incompleteTable.id)
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

  async createTableWithAttributes (project: Project, tableData: TableFormData, attributes: ValueAttributeFormData[]): Promise<Table> {
    const table = await this.createTable(project, tableData)
    const attributesIds = await Promise.all(attributes.map((attribute) => this.createValueAttribute(table, attribute)))
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
    return invokeSaveOperation<Table>(operation, data)
  }

  async createFactTable (project: Project, tableData: TableFormData): Promise<Table> {
    const operation = project.actions.createDimensionTable
    const data = {
      '@type': URI.TYPE_FACT_TABLE,
      [URI.PROP_NAME]: tableData.name,
      [URI.PROP_SOURCE]: tableData.sourceId
    }
    return invokeSaveOperation<Table>(operation, data)
  }

  async deleteTable (table: Table): Promise<void> {
    return invokeDeleteOperation(table.actions.delete)
  }

  async createSource (project: Project, file: File): Promise<Source> {
    const operation = project.actions.createSource
    const headers = {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${file.name}"`
    }
    return invokeSaveOperation<Source>(operation, file, headers)
  }

  async getSources (project: Project) {
    if (!project.sourcesCollection) throw new Error('Project has no sources collection')

    const sourcesCollection = await loadResource<Collection>(project.sourcesCollection.id)
    const incompleteSources = sourcesCollection.members

    const sources = Promise.all(incompleteSources.map(async (incompleteSource: HydraResource) =>
      loadResource(incompleteSource.id)
    ))

    return sources
  }

  async deleteSource (source: Source): Promise<void> {
    return invokeDeleteOperation(source.actions.delete)
  }

  async getSourceSampleData (source: Source) {
    if (!source.sampleCollection) throw new Error('Source has no sample collection')

    const loadedCollection = await loadResource<Collection>(source.sampleCollection.id)
    const rows = loadedCollection.members.map((row: HydraResource) => {
      return row[URI.API_CELLS]
    })

    return rows
  }

  async getAttributes (table: Table) {
    if (!table.attributesCollection) throw new Error('Table has no attributes collection')

    const collection = await loadResource<Collection>(table.attributesCollection.id)
    return collection.members
  }

  async createValueAttribute (table: Table, attributeData: ValueAttributeFormData): Promise<ValueAttribute> {
    const operation = table.actions.createValueAttribute
    const data = {
      '@type': URI.TYPE_VALUE_ATTRIBUTE,
      [URI.PROP_PREDICATE]: attributeData.predicateId,
      [URI.PROP_COLUMN]: attributeData.columnId,
      [URI.PROP_DATATYPE]: attributeData.dataTypeId,
      [URI.PROP_LANGUAGE]: attributeData.language
    }
    return invokeSaveOperation<ValueAttribute>(operation, data)
  }

  async createReferenceAttribute (table: Table, attributeData: ReferenceAttributeFormData): Promise<ReferenceAttribute> {
    const operation = table.actions.createReferenceAttribute
    const data = {
      '@type': URI.TYPE_REFERENCE_ATTRIBUTE,
      [URI.PROP_PREDICATE]: attributeData.predicateId,
      [URI.PROP_REFERENCED_TABLE]: attributeData.referencedTableId,
      [URI.PROP_COLUMN_MAPPING]: attributeData.columnMapping.map((mapping) => ({
        [URI.PROP_SOURCE_COLUMN]: mapping.sourceColumnId,
        [URI.PROP_REFERENCED_COLUMN]: mapping.referencedColumnId
      }))
    }
    return invokeSaveOperation<ReferenceAttribute>(operation, data)
  }

  async deleteAttribute (attribute: Attribute): Promise<void> {
    return invokeDeleteOperation(attribute.actions.delete)
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

async function invokeSaveOperation<T extends HydraResource = HydraResource> (operation: IOperation | null, data: Record<string, any> | File, headers: Record<string, any> = {}): Promise<T> {
  if (!operation) throw new Error('Operation does not exist')

  const serializedData = data instanceof File ? data : JSON.stringify(data)

  const response = await operation.invoke(serializedData, headers)
  if (![200, 201].includes(response.xhr.status)) {
    throw await APIError.fromResponse(response)
  }

  const resource = response.root
  if (!resource) {
    throw new Error('Response does not contain created resource')
  }

  return resource as T
}

async function invokeDeleteOperation (operation: IOperation | null): Promise<void> {
  if (!operation) throw new Error('Operation does not exist')

  const response = await operation.invoke('')

  if (response.xhr.status !== 204) {
    throw await APIError.fromResponse(response)
  }
}

export const client = new Client(apiURL)
