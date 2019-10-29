import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { ProjectsState, RootState } from '@/store/types'
import { ProjectId, Project, RemoteData } from '@/types'
import { client, OP_PROJECTS_CREATE } from '../../api'
import { IOperation } from 'alcaeus/types/Resources'

const initialState: ProjectsState = {
  projects: { isLoading: true },
  createOperation: null
}

const getters: GetterTree<ProjectsState, RootState> = {
  list (state): RemoteData<Project[]> {
    return {
      ...state.projects,
      data: Object.values(state.projects.data || {})
    }
  },

  one (state): (id: ProjectId) => RemoteData<Project> {
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
      const operations = await client.projects.operations()
      commit('storeAll', projects)
      commit('storeOperations', operations)
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

  async create ({ dispatch }, name) {
    const id = await client.projects.create(name)

    dispatch('loadOne', id)
  },

  async uploadSource ({ dispatch }, { project, file }) {
    // TODO: Handle error?
    const response = await client.projects.createSource(project, file)
    // Reload project to get the new source
    dispatch('loadOne', project.id)
  }
}

const mutations: MutationTree<ProjectsState> = {
  storeOperations (state, operations: IOperation[]) {
    state.createOperation = operations.find((op: IOperation) => op.supportedOperation.id === OP_PROJECTS_CREATE) || null
  },

  storeAll (state, projects: Project[]) {
    const emptyData: Record<ProjectId, Project> = {}
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

  loadingError (state, error) {
    console.error(error)

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
