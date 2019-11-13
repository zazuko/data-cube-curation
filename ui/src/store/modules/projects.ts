import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree, ActionContext } from 'vuex'
import { RootState } from '@/store/types'
import { ResourceId, Project, RemoteData } from '@/types'
import { client } from '../../api'

interface ProjectsState {
  projectsList: RemoteData<Project[]>;
  projects: Record<ResourceId, RemoteData<Project>>;
}

const initialState: ProjectsState = {
  projectsList: { isLoading: true, data: null, error: null },
  projects: {}
}

const getters: GetterTree<ProjectsState, RootState> = {
  list (state) {
    return state.projectsList
  },

  one (state): (id: ResourceId) => RemoteData<Project> {
    return (id) => {
      return state.projects[id] || { isLoading: true, data: null, error: null }
    }
  }
}

const actions: ActionTree<ProjectsState, RootState> = {
  async loadAll (context) {
    await handleAPIError(context, async () => {
      const projects = await client.projects.list()
      context.commit('storeAll', projects)
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
    state.projectsList = { isLoading: false, data: projects, error: null }
  },

  storeOne (state, project: Project) {
    Vue.set(state.projects, project.id, { isloading: false, data: project, error: null })
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
