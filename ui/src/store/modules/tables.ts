import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree, ActionContext } from 'vuex'
import { RootState } from '@/store/types'
import { ResourceId, Project, RemoteData, Table } from '@/types'
import { client } from '../../api'

interface TablesState {
  tables: Record<ResourceId, RemoteData<Table[]>>
}

const initialState: TablesState = {
  // Tables are stored per-project, indexed by projectId
  tables: {}
}

const getters: GetterTree<TablesState, RootState> = {
  forProject (state): (projectId: ResourceId) => RemoteData<Table[]> {
    return (projectId) => {
      return state.tables[projectId] || { isLoading: true, data: null, error: null }
    }
  }
}

const actions: ActionTree<TablesState, RootState> = {
  async loadForProject (context, project: Project) {
    await handleAPIError(context, async () => {
      const tables = await client.projects.getTables(project)

      context.commit('storeForProject', { project, tables })
    })
  },

  async create (context, { project, table }) {
    await handleAPIError(context, async () => {
      const id = await client.projects.createTable(project, table)
      // Reload tables to get the new one
      context.dispatch('loadForProject', project)
    })
  }
}

async function handleAPIError (context: ActionContext<TablesState, RootState>, f: () => Promise<any>): Promise<any> {
  try {
    return await f()
  } catch (error) {
    if (error.details) {
      context.commit('storeError', error.details, { root: true })
    } else {
      throw error
    }
  }
}

const mutations: MutationTree<TablesState> = {
  storeForProject (state, { project, tables }) {
    const data = { isLoading: false, data: tables, error: null }
    Vue.set(state.tables, project.id, data)
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
