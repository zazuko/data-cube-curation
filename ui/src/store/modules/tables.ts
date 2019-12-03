import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree, ActionContext } from 'vuex'
import { RootState } from '@/store/types'
import { ResourceId, Project, RemoteData, Table } from '@/types'
import { client } from '../../api'
import { handleAPIError } from '../common'
import Remote from '@/remote'

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
      return state.tables[projectId] || Remote.loading()
    }
  }
}

const actions: ActionTree<TablesState, RootState> = {
  async loadForProject (context, project: Project) {
    await handleAPIError(context, async () => {
      const tables = await client.projects.getTables(project)

      context.commit('storeForProject', { project, tables })

      tables.forEach((table) => {
        context.dispatch('attributes/loadForTable', table, { root: true })
      })
    })
  },

  async create (context, { project, table: tableData }) {
    await handleAPIError(context, async () => {
      const table = await client.projects.createTable(project, tableData)
      context.dispatch('attributes/loadForTable', table, { root: true })
      context.commit('storeInProject', { project, table })
    })
  },

  async delete (context, { project, table }) {
    await handleAPIError(context, async () => {
      await client.projects.deleteTable(table)
      // Reload tables
      context.dispatch('loadForProject', project)
    })
  },

  async createWithAttributes (context, { project, table: tableData, attributes }) {
    await handleAPIError(context, async () => {
      const table = await client.projects.createTableWithAttributes(project, tableData, attributes)
      context.dispatch('attributes/loadForTable', table, { root: true })
      context.commit('storeInProject', { project, table })
    })
  }
}

const mutations: MutationTree<TablesState> = {
  storeForProject (state, { project, tables }) {
    const data = Remote.loaded(tables)
    Vue.set(state.tables, project.id, data)
  },

  storeInProject (state, { project, table }) {
    const projectTables = state.tables[project.id]

    if (!projectTables.data) throw new Error('Project tables not loaded')

    projectTables.data.push(table)
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
