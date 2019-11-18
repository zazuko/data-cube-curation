import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RootState } from '@/store/types'
import { ResourceId, RemoteData, Table, Attribute } from '@/types'
import { client } from '../../api'
import { handleAPIError } from '../common'

interface AttributesState {
  // Attributes are stored per table, indexed by tableId
  attributes: Record<ResourceId, RemoteData<Attribute[]>>
}

const initialState: AttributesState = {
  attributes: {}
}

const getters: GetterTree<AttributesState, RootState> = {
  forTable (state): (projectId: ResourceId) => RemoteData<Attribute[]> {
    return (tableId) => {
      return state.attributes[tableId] || { isLoading: true, data: null, error: null }
    }
  }
}

const actions: ActionTree<AttributesState, RootState> = {
  async loadForTable (context, table: Table) {
    await handleAPIError(context, async () => {
      const attributes = await client.projects.getAttributes(table)

      context.commit('storeForTable', { table, attributes })
    })
  },

  async create (context, { table, attribute }) {
    await handleAPIError(context, async () => {
      const id = await client.projects.createAttribute(table, attribute)
      // Reload to get the new one
      context.dispatch('loadForTable', table)
    })
  }
}

const mutations: MutationTree<AttributesState> = {
  storeForTable (state, { table, attributes }) {
    const data = { isLoading: false, data: attributes, error: null }
    Vue.set(state.attributes, table.id, data)
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
