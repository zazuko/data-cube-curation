import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RootState } from '@/store/types'
import { Actions, ResourceId, Project, RemoteData } from '@/types'
import { client } from '../../api'
import { handleAPIError } from '../common'
import Remote from '@/remote'

interface ProjectsState {
  actions: Actions,
  projectsList: RemoteData<Project[]>;
  projects: Record<ResourceId, RemoteData<Project>>;
}

const initialState: ProjectsState = {
  actions: {},
  projectsList: Remote.loading(),
  projects: {}
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
      context.commit('storeAll', projects)

      const actions = await client.projects.actions()
      context.commit('storeActions', actions)
    })
  },

  async loadOne (context, id) {
    await handleAPIError(context, async () => {
      const project = await client.projects.get(id)
      context.commit('storeOne', project)

      context.dispatch('tables/loadForProject', project, { root: true })
      context.dispatch('sources/loadForProject', project, { root: true })
    })
  },

  async save (context, { operation, data }) {
    return handleAPIError(context, async () => {
      const project = await client.projects.save(operation, data)
      context.commit('storeOneInList', project)
      context.commit('storeOne', project)
      return project
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
  storeAll (state, projects: Project[]) {
    state.projectsList = Remote.loaded(projects)
  },

  storeActions (state, actions: Actions) {
    state.actions = actions
  },

  storeOneInList (state, project: Project) {
    if (!state.projectsList.data) return

    state.projectsList.data = state.projectsList.data.filter((p) => p.id !== project.id)
    state.projectsList.data.push(project)
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
