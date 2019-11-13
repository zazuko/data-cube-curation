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

    <div v-for="source in project.sources" :key="source.id" class="sources-list">
      <article class="card">
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
    </div>
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
import { Project, ResourceId, Table, Source } from '../../types'

@Component({
  components: {
    TableTag
  }
})
export default class ProjectDataView extends Vue {
  get projectId (): ResourceId {
    return this.$route.params.id
  }

  get project (): Project {
    const remoteProject = this.$store.getters['projects/one'](this.projectId)
    // Assume project is loaded because we're in a nested view
    return remoteProject.data
  }

  get tables (): Table[] {
    return this.project.tables.data || []
  }

  uploadSource (file: File) {
    this.$store.dispatch('projects/uploadSource', {
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
