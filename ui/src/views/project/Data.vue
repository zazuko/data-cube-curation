<template>
  <div class="input-data">
    <div class="buttons">
      <b-upload @input="uploadSource" accept=".csv" v-if="project.actions.createSource">
        <a class="button is-primary">
          <b-icon icon="upload"></b-icon>
          <span>{{ project.actions.createSource.title }}</span>
        </a>
      </b-upload>
    </div>

    <Loader :data="sources" v-slot="{ data: sources }" class="sources-list">
      <article class="card" v-for="source in sources" :key="source.id">
        <header class="card-header">
          <h2 class="card-header-title">{{ source.name }}</h2>
          <div class="card-header-icon">
            <b-button icon-left="trash-can-outline" v-if="source.actions.delete"></b-button>
          </div>
        </header>
        <section class="card-content">
          <b-table
            :data="source.data"
            bordered
            striped
            narrowed
          >
            <template slot="empty">File is empty</template>
            <template slot-scope="props">
              <b-table-column v-for="(column, index) in source.columns" :key="index" :field="column.field" :label="column.label">
                <template slot="header">
                  {{ column.label }}
                  <b-taglist>
                    <TableTag v-for="attribute in columnAttributes(column)" :key="attribute.id" :table="attribute.table">
                      {{ attribute.table.name }} > {{ attribute.property }}
                    </TableTag>
                  </b-taglist>
                </template>
                {{ props.row[column.field] }}
              </b-table-column>
            </template>
          </b-table>
        </section>
        <footer class="card-footer">
          <b-button icon-right="chevron-double-down" class="is-fullwidth">
            Show more
          </b-button>
        </footer>
      </article>
    </Loader>
  </div>
</template>

<style>
  .sources-list > .card > .card-content {
    padding: 0;
    overflow-x: scroll;
  }
</style>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import TableTag from '../../components/TableTag.vue'
import { Project, ResourceId, Table, Source, RemoteData } from '@/types'
import Loader from '@/components/Loader.vue'

@Component({
  components: {
    TableTag,
    Loader
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

  columnAttributes (column: any) {
    // TODO
    return []
  }
}
</script>
