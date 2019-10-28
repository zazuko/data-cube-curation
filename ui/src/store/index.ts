import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import projects from './modules/projects';
import projectsFixtures from './modules/projects-fixtures';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: {
    projects,
    projectsFixtures,
  },
};

export default new Vuex.Store<RootState>(store);
