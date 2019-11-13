import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree, ActionContext } from 'vuex'
import { RootState } from '@/store/types'
import { ResourceId, Project, RemoteData, Source } from '@/types'
import { client } from '../../api'
import { handleAPIError } from '../common'

interface SourcesState {
  // Sources are stored per-project, indexed by projectId
  sources: Record<ResourceId, RemoteData<Source[]>>;
}

const initialState: SourcesState = {
  sources: {}
}

const getters: GetterTree<SourcesState, RootState> = {
  forProject (state): (projectId: ResourceId) => RemoteData<Source[]> {
    return (projectId) => {
      return state.sources[projectId] || { isLoading: true, data: null, error: null }
    }
  }
}

const actions: ActionTree<SourcesState, RootState> = {
  async loadForProject (context, project: Project) {
    await handleAPIError(context, async () => {
      const sources = await client.projects.getSources(project)

      context.commit('storeForProject', { project, sources })
    })
  },

  async upload (context, { project, file }) {
    await handleAPIError(context, async () => {
      const id = await client.projects.createSource(project, file)

      // Reload sources to get the new one
      context.dispatch('loadForProject', project)
    })
  }
}

const mutations: MutationTree<SourcesState> = {
  storeForProject (state, { project, sources }) {
    const data = { isLoading: false, data: sources, error: null }
    Vue.set(state.sources, project.id, data)
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
