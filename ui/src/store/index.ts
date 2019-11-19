import Vue from 'vue'
import Vuex, { StoreOptions, ActionTree, MutationTree } from 'vuex'
import { RootState } from './types'
import projects from './modules/projects'
import tables from './modules/tables'
import sources from './modules/sources'
import sourcesData from './modules/sources-data'
import attributes from './modules/attributes'
import { IOperation } from 'alcaeus/types/Resources'
import { invokeCreateOperation, invokeDeleteOperation } from '@/api'
import { handleAPIError } from '@/store/common'

Vue.use(Vuex)

const actions: ActionTree<RootState, RootState> = {
  dismissError ({ commit }, error) {
    commit('removeError', error)
  },
  async invokeOperation (context, { operation, body }: { operation: IOperation, body: any }) {
    await handleAPIError(context, () => {
      if (operation.method === 'DELETE') {
        return invokeDeleteOperation(operation)
      }

      return invokeCreateOperation(operation, body)
    })
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
    sources,
    sourcesData,
    attributes
  }
}

export default new Vuex.Store<RootState>(store)
