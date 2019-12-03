import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RootState } from '@/store/types'
import { ResourceId, RemoteData, Table, Attribute } from '@/types'
import { client } from '../../api'
import { handleAPIError } from '../common'
import Remote from '@/remote'

interface AttributesState {
  // Attributes are stored per table, indexed by tableId
  attributes: Record<ResourceId, RemoteData<Attribute[]>>
}

const initialState: AttributesState = {
  attributes: {}
}

const getters: GetterTree<AttributesState, RootState> = {
  forTable (state): (tableId: ResourceId) => RemoteData<Attribute[]> {
    return (tableId) => {
      return state.attributes[tableId] || Remote.loading()
    }
  },

  forTables (state, getters): (tables: Table[]) => RemoteData<Attribute[]> {
    return (tables) => {
      const tablesAttributes = tables.map((table) => {
        return getters.forTable(table.id)
      })

      const isLoading = tablesAttributes.reduce((acc, d) => acc || d.isLoading, false)
      const data = tablesAttributes.reduce((acc, d) => acc.concat(d.data || []), [])

      return { isLoading: isLoading, data: data, error: null }
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

  async create (context, { table, attribute: attributeData }) {
    await handleAPIError(context, async () => {
      const attribute = await client.projects.createAttribute(table, attributeData)
      context.commit('storeInTable', { table, attribute })
    })
  }
}

const mutations: MutationTree<AttributesState> = {
  storeForTable (state, { table, attributes }) {
    const data = Remote.loaded(attributes)
    Vue.set(state.attributes, table.id, data)
  },

  storeInTable (state, { table, attribute }) {
    const tableAttributes = state.attributes[table.id]

    if (!tableAttributes.data) throw new Error('Table attributes not loaded')

    tableAttributes.data.push(attribute)
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
