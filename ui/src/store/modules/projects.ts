import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree, ActionContext } from 'vuex'
import { ProjectsState, RootState } from '@/store/types'
import { ResourceId, Project, RemoteData } from '@/types'
import { client } from '../../api'

const initialState: ProjectsState = {
  projects: { isLoading: true, data: null, error: null }
}

const getters: GetterTree<ProjectsState, RootState> = {
  list (state): RemoteData<Project[]> {
    return {
      ...state.projects,
      data: Object.values(state.projects.data || {})
    }
  },

  one (state): (id: ResourceId) => RemoteData<Project> {
    return (id) => {
      const project = (state.projects.data || {})[id]
      return {
        ...state.projects,
        data: project
      }
    }
  }
}

const actions: ActionTree<ProjectsState, RootState> = {
  async loadAll ({ commit }) {
    try {
      const projects = await client.projects.list()
      commit('storeAll', projects)
    } catch (error) {
      commit('loadingError', error)
    }
  },

  async loadOne ({ commit }, id) {
    try {
      const project = await client.projects.get(id)
      commit('storeOne', project)
    } catch (error) {
      commit('loadingError', error)
    }
  },

  async create ({ dispatch, commit }, name) {
    try {
      const id = await client.projects.create(name)
      dispatch('loadOne', id)
    } catch (error) {
      commit('storeError', error.details, { root: true })
    }
  },

  async delete ({ dispatch, commit }, project) {
    try {
      await client.projects.delete(project)
      commit('removeOne', project)
    } catch (error) {
      commit('storeError', error.details, { root: true })
    }
  },

  async uploadSource ({ dispatch, commit }, { project, file }) {
    try {
      await client.projects.createSource(project, file)
      // Reload project to get the new source
      dispatch('loadOne', project.id)
    } catch (error) {
      commit('storeError', error.details, { root: true })
    }
  },

  async loadTables (context, project) {
    await handleAPIError(context, async () => {
      const tables = await client.projects.getTables(project)

      context.commit('storeTables', { project, tables })
    })
  },

  async createTable (context, { project, table }) {
    await handleAPIError(context, async () => {
      await client.projects.createTable(project, table)
      // Reload tables to get the new one
      context.dispatch('loadTables', project)
    })
  }
}

async function handleAPIError (context: ActionContext<ProjectsState, RootState>, f: () => Promise<any>): Promise<any> {
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

const mutations: MutationTree<ProjectsState> = {
  storeAll (state, projects: Project[]) {
    const emptyData: Record<ResourceId, Project> = {}
    state.projects.data = projects.reduce((acc, project) => {
      acc[project.id] = project
      return acc
    }, emptyData)
    state.projects.isLoading = false
  },

  storeOne (state, project: Project) {
    state.projects.data = Object.assign({}, state.projects.data, { [project.id]: project })
    state.projects.isLoading = false
  },

  storeTables (state, { project, tables }) {
    if (!state.projects.data) throw new Error('Project not loaded')

    state.projects.data[project.id].tables = { isLoading: false, data: tables, error: null }
  },

  removeOne (state, project: Project) {
    if (!state.projects.data) return

    Vue.delete(state.projects.data, project.id)
  },

  loadingError (state, error) {
    state.projects.isLoading = false
    state.projects.error = 'Error: could not load projects'
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
