import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import projects from './modules/projects';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {},
  modules: {
    projects,
  },
};

export default new Vuex.Store<RootState>(store);
