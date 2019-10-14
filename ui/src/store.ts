import Vue from 'vue';
import Vuex from 'vuex';
import { Hydra } from 'alcaeus';
import { ICollection } from 'alcaeus/types/Resources';
import { Project } from './types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    projects: [],
  },

  mutations: {
    setProjects(state, projects) {
      state.projects = projects;
    },
  },

  actions: {
    async getAllProjects({ commit }) {
      const response = await Hydra.loadResource('http://localhost:5678/projects');
      const projectsCollection = response.root as ICollection | null;

      if (!projectsCollection) { return; }

      const projects = projectsCollection.members.map((project) => ({
          id: project.id,
          name: project.get('http://schema.org/name') || '',
      }));
      commit('setProjects', projects);
    },
  },
});
