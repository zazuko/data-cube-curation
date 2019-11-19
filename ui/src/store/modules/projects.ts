import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RootState } from '@/store/types'
import { ResourceId, Project, RemoteData } from '@/types'
import { client } from '@/api'
import { handleAPIError } from '../common'
import Remote from '@/remote'
import { IOperation } from 'alcaeus/types/Resources'
import { OP_PROJECTS_CREATE } from '@/api/uris'

interface ProjectsState {
  projectsList: RemoteData<Project[]>;
  projects: Record<ResourceId, RemoteData<Project>>;
  createOperation: IOperation | null
}

const initialState: ProjectsState = {
  projectsList: Remote.loading(),
  projects: {},
  createOperation: null
}

const getters: GetterTree<ProjectsState, RootState> = {
  list (state) {
    return state.projectsList
  },

  one (state): (id: ResourceId) => RemoteData<Project> {
    return (id) => {
      return state.projects[id] || Remote.loading()
    }
  }
}

const actions: ActionTree<ProjectsState, RootState> = {
  async loadAll (context) {
    await handleAPIError(context, async () => {
      const projects = await client.projects.list()
      const operations = (await client.projects.projectsCollection())!.operations
      context.commit('storeAll', projects)
      context.commit('storeOperations', operations)
    })
  },

  async loadOne (context, id) {
    await handleAPIError(context, async () => {
      const project = await client.projects.get(id)
      context.commit('storeOne', project)
    })
  },

  async create (context, name) {
    await handleAPIError(context, async () => {
      const id = await client.projects.create(name)
      context.dispatch('loadAll', id)
    })
  },

  async delete (context, project) {
    await handleAPIError(context, async () => {
      await client.projects.delete(project)
      context.commit('removeOne', project)
    })
  },

  async loadSources (context, project) {
    await handleAPIError(context, async () => {
      const sources = await client.projects.getSources(project)

      context.commit('storeSources', { project, sources })
    })
  }
}

const mutations: MutationTree<ProjectsState> = {
  storeOperations (state, operations: IOperation[]) {
    state.createOperation = operations.find((op: IOperation) => op.supportedOperation.id === OP_PROJECTS_CREATE) || null
  },

  storeAll (state, projects: Project[]) {
    state.projectsList = Remote.loaded(projects)
  },

  storeOne (state, project: Project) {
    Vue.set(state.projects, project.id, Remote.loaded(project))
  },

  removeOne (state, project: Project) {
    if (!state.projectsList.data) return

    // Delete from projects list
    state.projectsList.data = state.projectsList.data.filter((p) => p.id !== project.id)

    // Delete from projects
    Vue.delete(state.projects, project.id)
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
