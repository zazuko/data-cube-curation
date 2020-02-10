import Vue from 'vue'
import Vuex, { StoreOptions, ActionTree, MutationTree } from 'vuex'
import { loadRDFProperties } from '../rdf-vocabularies'
import { RootState } from './types'
import projects from './modules/projects'
import tables from './modules/tables'
import sources from './modules/sources'
import sourcesData from './modules/sources-data'
import attributes from './modules/attributes'

Vue.use(Vuex)

const actions: ActionTree<RootState, RootState> = {
  dismissError ({ commit }, error) {
    commit('removeError', error)
  },

  async loadRDFProperties ({ commit }) {
    const properties = await loadRDFProperties()
    commit('storeRDFProperties', properties)
  },
}

const mutations: MutationTree<RootState> = {
  storeError (state, error) {
    state.errors.push(error)
  },

  removeError (state, error) {
    state.errors.splice(state.errors.indexOf(error), 1)
  },

  storeRDFProperties (state, properties) {
    state.rdfProperties = properties
  },
}

const store: StoreOptions<RootState> = {
  strict: process.env.NODE_ENV !== 'production',
  state: {
    errors: [],
    rdfProperties: [],
  },
  actions,
  mutations,
  modules: {
    projects,
    tables,
    sources,
    sourcesData,
    attributes,
  },
}

export default new Vuex.Store<RootState>(store)
