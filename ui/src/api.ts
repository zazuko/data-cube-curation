import { Hydra } from 'alcaeus'
import { HydraResource, ICollection, IOperation } from 'alcaeus/types/Resources'
import projectsFixtures from './projects-fixtures'

const apiURL = process.env.VUE_APP_API_URL

const PROJECT_TYPE = 'https://rdf-cube-curation.described.at/Project'
const SOURCE_TYPE = 'https://rdf-cube-curation.described.at/Source'
const FACT_TABLE_TYPE = 'https://rdf-cube-curation.described.at/FactTable'

const NAME_PROPERTY = 'http://schema.org/name'
const PROJECTS_PROPERTY = 'https://rdf-cube-curation.described.at/api/projects'
const SOURCES_PROPERTY = 'https://rdf-cube-curation.described.at/api/sources'
const OP_PROJECTS_GET = 'https://rdf-cube-curation.described.at/api/GetDataCubeProjects'
const OP_PROJECTS_CREATE = 'https://rdf-cube-curation.described.at/api/CreateProject'
const OP_SOURCES_CREATE = 'https://rdf-cube-curation.described.at/api/AddSource'

type Constructor<T = {}> = new (...args: any[]) => HydraResource;

const ProjectMixin = {
  Mixin<B extends Constructor> (Base: B) {
    return class extends Base {
      get name () {
        return this.get(NAME_PROPERTY)
      }

      get sourcesCollection () {
        return this[SOURCES_PROPERTY] as ICollection | null
      }

      get sources () {
        if (!this.sourcesCollection) { return [] }

        // TODO: Alcaeus doesn't assign the correct type to these objects
        // so they don't get applied the proper Mixin.
        return this.sourcesCollection.members.map((source) => ({
          ...source,
          name: source.get(NAME_PROPERTY)
        }))
      }
    }
  },

  shouldApply (resource: HydraResource) {
    return resource.types.contains(PROJECT_TYPE)
  }
}

const SourceMixin = {
  Mixin<B extends Constructor> (Base: B) {
    return class extends Base {
      get name () {
        return this.get(NAME_PROPERTY)
      }
    }
  },

  shouldApply (resource: HydraResource) {
    return resource.types.contains(SOURCE_TYPE)
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
      this.cachedResource = getOrThrow(entrypoint, PROJECTS_PROPERTY)
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
      return projectsFixtures.find((p) => p.id === id)
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
