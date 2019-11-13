import Vue from 'vue'
import Vuex, { StoreOptions, ActionTree, MutationTree } from 'vuex'
import { RootState } from './types'
import projects from './modules/projects'
import tables from './modules/tables'
import sources from './modules/sources'

Vue.use(Vuex)

const actions: ActionTree<RootState, RootState> = {
  dismissError ({ commit }, error) {
    commit('removeError', error)
  }
}

const mutations: MutationTree<RootState> = {
  storeError (state, error) {
    state.errors.push(error)
  },

  removeError (state, error) {
    state.errors.splice(state.errors.indexOf(error), 1)
  }
}

const store: StoreOptions<RootState> = {
  strict: process.env.NODE_ENV !== 'production',
  state: {
    errors: []
  },
  actions,
  mutations,
  modules: {
    projects,
    tables,
    sources
  }
}

export default new Vuex.Store<RootState>(store)
