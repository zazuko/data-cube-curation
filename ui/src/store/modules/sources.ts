import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { IOperation } from 'alcaeus/types/Resources'
import { RootState } from '@/store/types'
import { ResourceId, Project, RemoteData, Source, SourceFormData } from '@/types'
import { client } from '../../api'
import { handleAPIError } from '../common'
import Remote from '@/remote'

interface SourcesState {
  // Sources are stored per-project, indexed by projectId
  sources: Record<ResourceId, RemoteData<Source[]>>;
}

const initialState: SourcesState = {
  sources: {},
}

const getters: GetterTree<SourcesState, RootState> = {
  forProject (state): (projectId: ResourceId) => RemoteData<Source[]> {
    return (projectId) => {
      return state.sources[projectId] || Remote.loading()
    }
  },

  one (state, getters): (projectId: ResourceId, sourceId: ResourceId) => RemoteData<Source> {
    return (projectId, sourceId) => {
      const projectSources = getters.forProject(projectId)
      const source = (projectSources.data || []).find((s: Source) => s.id === sourceId)

      return {
        ...projectSources,
        data: source,
      }
    }
  },
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
      const source = await client.projects.createSource(project, file)
      context.commit('storeInProject', { project, source })
    })
  },

  async delete (context, source: Source) {
    await handleAPIError(context, async () => {
      await client.projects.deleteSource(source)
      context.commit('removeOne', source)
    })
  },

  async update (context, { project, operation, data }: { project: Project, operation: IOperation, data: SourceFormData }) {
    await handleAPIError(context, async () => {
      const source = await client.projects.updateSource(operation, data)

      context.commit('removeOne', source)
      context.commit('storeInProject', { project, source })
    })
  },
}

const mutations: MutationTree<SourcesState> = {
  storeForProject (state, { project, sources }) {
    const data = Remote.loaded(sources)
    Vue.set(state.sources, project.id, data)
  },

  storeInProject (state, { project, source }) {
    const projectSources = state.sources[project.id]

    if (!projectSources.data) throw new Error('Project sources not loaded')

    projectSources.data.push(source)
  },

  removeOne (state, source: Source) {
    const projectSources = state.sources[source.projectId]

    if (!projectSources.data) return

    projectSources.data = projectSources.data.filter((s) => s.id !== source.id)
  },
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations,
}
