<template>
  <div class="input-sources">
    <div class="level">
      <div class="level-left">
        <b-upload @input="uploadSource" accept=".csv" v-if="project.actions.createSource" class="level-item">
          <a class="button is-primary">
            <b-icon icon="upload"></b-icon>
            <span>Upload source CSV file</span>
          </a>
        </b-upload>
      </div>
      <div class="level-right">
        <p class="level-item">Filter columns:</p>
        <b-field class="level-item">
          <b-radio-button v-model="columnFilter" native-value="all" size="is-small">
            All
          </b-radio-button>
          <b-radio-button v-model="columnFilter" native-value="mapped" size="is-small">
            Mapped
          </b-radio-button>
          <b-radio-button v-model="columnFilter" native-value="not-mapped" size="is-small">
            Not mapped
          </b-radio-button>
        </b-field>
      </div>
    </div>

    <Loader :data="tables" v-slot="{ data: tables }">
      <Loader :data="sources" v-slot="{ data: sources }" class="sources-list">
          <SourceItem v-for="source in sources" :key="source.id" :project="project" :source="source" :tables="tables" :column-filter="columnFilter" />
          <p v-if="sources.length < 1" class="has-text-grey">
            No sources yet
          </p>
      </Loader>
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
import { Component, Vue } from 'vue-property-decorator'
import { Project, Table, Source, RemoteData, SourceColumnFilter } from '@/types'
import Loader from '@/components/Loader.vue'
import SourceItem from '@/components/project/SourceItem.vue'

@Component({
  components: {
    Loader,
    SourceItem
  }
})
export default class extends Vue {
  columnFilter: SourceColumnFilter = 'all'

  get project (): Project {
    const projectId = this.$route.params.id
    const remoteProject = this.$store.getters['projects/one'](projectId)
    // Assume project is loaded because we're in a nested view
    return remoteProject.data
  }

  get sources (): RemoteData<Source[]> {
    return this.$store.getters['sources/forProject'](this.project.id)
  }

  get tables (): RemoteData<Table[]> {
    return this.$store.getters['tables/forProject'](this.project.id)
  }

  async uploadSource (file: File) {
    const loading = this.$buefy.loading.open({})
    try {
      await this.$store.dispatch('sources/upload', { project: this.project, file })
    } finally {
      loading.close()
    }
  }
}
</script>
