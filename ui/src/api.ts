import { Hydra } from 'alcaeus';
import { HydraResource, ICollection } from 'alcaeus/types/Resources';

const apiURL = process.env.VUE_APP_API_URL;

const PROJECT_TYPE = 'https://rdf-cube-curation.described.at/Project';
const SOURCE_TYPE = 'https://rdf-cube-curation.described.at/Source';
const FACT_TABLE_TYPE = 'https://rdf-cube-curation.described.at/FactTable';

const NAME_PROPERTY = 'http://schema.org/name';
const SOURCES_PROPERTY = 'https://rdf-cube-curation.described.at/api/sources';


type Constructor<T = {}> = new (...args: any[]) => HydraResource;


const ProjectMixin = {
  Mixin<B extends Constructor>(Base: B) {
    return class extends Base {
      get name() {
        return this.get(NAME_PROPERTY);
      }

      get sourcesCollection() {
        return this[SOURCES_PROPERTY] as ICollection | null;
      }

      get sources() {
        if (!this.sourcesCollection) { return []; }

        // TODO: Alcaeus doesn't assign the correct type to these objects
        // so they don't get applied the proper Mixin.
        return this.sourcesCollection.members.map((source) => ({
          ...source,
          name: source.get(NAME_PROPERTY),
        }));
      }
    };
  },

  shouldApply(resource: HydraResource) {
    return resource.types.contains(PROJECT_TYPE);
  },
};


const SourceMixin = {
  Mixin<B extends Constructor>(Base: B) {
    return class extends Base {
      get name() {
        return this.get(NAME_PROPERTY);
      }
    };
  },

  shouldApply(resource: HydraResource) {
    return resource.types.contains(SOURCE_TYPE);
  },
};


const rdf = Hydra.mediaTypeProcessors.RDF as any;
rdf.resourceFactory.mixins.push(ProjectMixin);
rdf.resourceFactory.mixins.push(SourceMixin);


export class Client {
  url: string;
  projects: ProjectsClient;

  constructor(url: string) {
    if (!url) { throw new Error('API URL not defined'); }

    this.url = url;

    this.projects = new ProjectsClient(this);
  }

  path(relativePath: string) {
    return this.url + relativePath;
  }
}


// TODO: Can we generate this from API description somehow?
class ProjectsClient {
  api: Client;

  constructor(api: Client) {
    this.api = api;
  }

  async list() {
    const url = this.api.path('/projects');
    const response = await Hydra.loadResource(url);
    const projectsCollection = response.root as ICollection | null;

    if (!projectsCollection) {
      throw new Error('No `root` in Hydra response');
    }

    return projectsCollection.members || [];
  }

  async get(id: string) {
    const response = await Hydra.loadResource(id);
    const project = response.root;

    if (!project) {
      throw new Error(`Project does not exist: {id}`);
    }

    return project;
  }

  async createSource(project: any, file: File) {
    const operation = project.sourcesCollection.operations.find((op: any) => op.method === 'POST');
    const headers = {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${file.name}"`,
    };
    await operation.invoke(file, headers);
  }
}


export const client = new Client(apiURL);
