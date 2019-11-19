import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree, ActionContext } from 'vuex'
import { RootState } from '@/store/types'
import { ResourceId, Project, RemoteData, Source } from '@/types'
import { client } from '../../api'
import { handleAPIError } from '../common'
import Remote from '@/remote'

interface SourcesDataState {
  // Source sample data are stored per-source, indexed by sourceId
  data: Record<ResourceId, RemoteData<string[][]>>;
}

const initialState: SourcesDataState = {
  data: {}
}

const getters: GetterTree<SourcesDataState, RootState> = {
  forSource (state): (sourceId: ResourceId) => RemoteData<string[][]> {
    return (sourceId) => {
      return state.data[sourceId] || Remote.loading()
    }
  }
}

const actions: ActionTree<SourcesDataState, RootState> = {
  async loadForSource (context, source: Source) {
    await handleAPIError(context, async () => {
      const rows = await client.projects.getSourceSampleData(source)

      context.commit('storeForSource', { source, rows })
    })
  }
}

const mutations: MutationTree<SourcesDataState> = {
  storeForSource (state, { source, rows }) {
    const data = Remote.loaded(rows)
    Vue.set(state.data, source.id, data)
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
