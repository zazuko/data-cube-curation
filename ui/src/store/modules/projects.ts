import { ActionTree, MutationTree, GetterTree } from 'vuex';
import { ProjectsState, RootState } from '@/store/types';
import { ProjectId, Project, RemoteData } from '@/types';
import { Hydra } from 'alcaeus';
import { ICollection } from 'alcaeus/types/Resources';


const initialState: ProjectsState = {
  projects: {isLoading: true},
};

const getters: GetterTree<ProjectsState, RootState> = {
  list(state): RemoteData<Project[]> {
    return {
      ...state.projects,
      data: Object.values(state.projects.data || {}),
    };
  },
};

const actions: ActionTree<ProjectsState, RootState> = {
  async loadAll({ commit }) {
    Hydra.loadResource('http://localhost:5678/projects')
      .then((response) => {
        const projectsCollection = response.root as ICollection | null;

        if (!projectsCollection) {
          throw Error('No `root` in Hydra response');
        }

        const members = projectsCollection.members || [];
        const projects = members.map((project) => ({
          id: project.id,
          name: project.get('http://schema.org/name') || '',
        }));
        commit('storeAll', projects);
      })
      .catch((error) => {
        commit('loadingError', error);
      });
  },
};

const mutations: MutationTree<ProjectsState> = {
  storeAll(state, projects: Project[]) {
    const emptyData: Record<ProjectId, Project> = {};
    state.projects.data = projects.reduce((acc, project) => {
      acc[project.id] = project;
      return acc;
    }, emptyData);
    state.projects.isLoading = false;
  },

  loadingError(state, error) {
    state.projects.isLoading = false;
    state.projects.error = 'Error: could not load projects';
  },
};


export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations,
};
