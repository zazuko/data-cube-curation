import { Hydra } from 'alcaeus';
import { HydraResource, ICollection } from 'alcaeus/types/Resources';

const apiURL = process.env.VUE_APP_API_URL;

const PROJECT_TYPE = 'https://rdf-cube-curation.described.at/Project';


type Constructor<T = {}> = new (...args: any[]) => HydraResource;


const ProjectMixin = {
  Mixin<B extends Constructor>(Base: B) {
    return class extends Base {
      get name() {
        return this.get('http://schema.org/name');
      }
    };
  },

  shouldApply(resource: HydraResource) {
    return resource.types.contains(PROJECT_TYPE);
  },
};


Hydra.mediaTypeProcessors.RDF.resourceFactory.mixins.push(ProjectMixin);


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
}


export const client = new Client(apiURL);
