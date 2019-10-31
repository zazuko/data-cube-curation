import { Hydra } from 'alcaeus'
import { HydraResource, ICollection, IOperation } from 'alcaeus/types/Resources'
import { expand, prefixes } from '@zazuko/rdf-vocabularies'
import projectsFixtures from './projects-fixtures'
import { Project, ProjectId } from './types'

prefixes.dataCube = 'https://rdf-cube-curation.described.at/'

const apiURL = process.env.VUE_APP_API_URL

const TYPE_PROJECT = expand('dataCube:Project')
const TYPE_SOURCE = expand('dataCube:Source')
const TYPE_FACT_TABLE = expand('dataCube:FactTable')

const PROP_NAME = expand('schema:name')

const API_PROJECTS = expand('dataCube:api/projects')
const API_SOURCES = expand('dataCube:api/sources')
const OP_PROJECTS_GET = expand('dataCube:api/GetDataCubeProjects')
const OP_PROJECTS_CREATE = expand('dataCube:api/CreateProject')
const OP_SOURCES_CREATE = expand('dataCube:api/AddSource')

type Constructor<T = {}> = new (...args: any[]) => HydraResource;

const ProjectMixin = {
  Mixin<B extends Constructor> (Base: B) {
    return class extends Base {
      get name () {
        return this.get(PROP_NAME)
      }

      get sourcesCollection () {
        return this[API_SOURCES] as ICollection | null
      }

      get sources () {
        if (!this.sourcesCollection) { return [] }

        return this.sourcesCollection.members
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

const rdf = Hydra.mediaTypeProcessors.RDF as any
rdf.resourceFactory.mixins.push(ProjectMixin)
rdf.resourceFactory.mixins.push(SourceMixin)

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
    const projectsCollection = getOrThrow(response, 'root') as ICollection

    return projectsCollection.members || []
  }

  async get (id: string) {
    const response = await Hydra.loadResource(id)
    return getOrThrow(response, 'root')
  }

  async createSource (project: any, file: File) {
    const operation = getOperation(project.sourcesCollection, OP_SOURCES_CREATE)
    const headers = {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${file.name}"`
    }
    await operation.invoke(file, headers)
  }
}

function getOrThrow (obj: any, prop: string) {
  const value = obj[prop]

  if (!prop) {
    throw new Error(`No ${prop} found in ${obj}`)
  }

  return value
}

function getOperation (resource: HydraResource, operationId: string) {
  const operation = resource.operations.find((op: IOperation) => op.supportedOperation.id === operationId)

  if (!operation) {
    throw new Error(`Operation ${operationId} not found on ${resource.id}`)
  }

  return operation
}

class FixturesClient {
  projects = {
    async list () {
      return projectsFixtures
    },

    async get (id: string) {
      return projectsFixtures.find((p: Project) => p.id === id)
    },

    async createSource () {
      throw new Error('Not implemented')
    }
  };
}

let theClient
if (process.env.VUE_APP_USE_FIXTURES === 'true') {
  theClient = new FixturesClient()
} else {
  theClient = new Client(apiURL)
}

export const client = theClient
