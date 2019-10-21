import { ActionTree, MutationTree, GetterTree } from 'vuex';
import { ProjectsState, RootState } from '@/store/types';
import { ProjectId, Project, RemoteData } from '@/types';
import { client } from '../../api';


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

  one(state): (id: ProjectId) => RemoteData<Project> {
    return (id) => {
      const project = (state.projects.data || {})[id];
      return {
        ...state.projects,
        data: project,
      };
    };
  },
};

const actions: ActionTree<ProjectsState, RootState> = {
  async loadAll({ commit }) {
    try {
      const projects = await client.projects.list();
      commit('storeAll', projects);
    } catch (error) {
      commit('loadingError', error);
    }
  },

  async loadOne({ commit }, id) {
    try {
      const project = await client.projects.get(id);
      commit('storeOne', project);
    } catch (error) {
      commit('loadingError', error);
    }
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

  storeOne(state, project: Project) {
    if (!state.projects.data) {
      state.projects.data = {};
    }

    state.projects.data[project.id] = project;
    state.projects.isLoading = false;
  },

  loadingError(state, error) {
    console.error(error);

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
