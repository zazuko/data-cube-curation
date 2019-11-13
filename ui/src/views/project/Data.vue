<template>
  <div class="input-data">
    <div class="buttons">
      <b-upload @input="uploadSource" accept=".csv" v-if="project.actions.createSource">
        <a class="button is-primary">
          <b-icon icon="upload"></b-icon>
          <span>Upload source CSV file</span>
        </a>
      </b-upload>
    </div>

    <Loader :data="sources" v-slot="{ data: sources }" class="sources-list">
      <SourceItem v-for="source in sources" :key="source.id" :source="source" :tables="tables" />
      <p v-if="sources.length < 1" class="has-text-grey">
        No sources yet
      </p>
    </Loader>
  </div>
</template>

<style>
  .sources-list > .card {
    margin-bottom: 1rem;
  }

  .sources-list > .card > .card-content {
    padding: 0;
    overflow-x: scroll;
  }
</style>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { Project, ResourceId, Table, Source, RemoteData } from '@/types'
import Loader from '@/components/Loader.vue'
import SourceItem from '@/components/project/SourceItem.vue'

@Component({
  components: {
    Loader,
    SourceItem
  }
})
export default class ProjectDataView extends Vue {
  get project (): Project {
    const projectId = this.$route.params.id
    const remoteProject = this.$store.getters['projects/one'](projectId)
    // Assume project is loaded because we're in a nested view
    return remoteProject.data
  }

  created () {
    this.$store.dispatch('sources/loadForProject', this.project)
  }

  get sources (): RemoteData<Source[]> {
    return this.$store.getters['sources/forProject'](this.project.id)
  }

  get tables (): RemoteData<Table[]> {
    return this.$store.getters['tables/forProject'](this.project.id)
  }

  uploadSource (file: File) {
    this.$store.dispatch('sources/upload', {
      project: this.project,
      file
    })
  }
}
</script>
