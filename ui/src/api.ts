import { Hydra } from 'alcaeus';
import { HydraResource } from 'alcaeus/types/Resources';


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


export const client = Hydra;
