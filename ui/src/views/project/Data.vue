<template>
  <div class="input-data">
    <b-field class="file">
      <b-upload @input="uploadSource" accept=".csv">
        <a class="button is-primary">
          <b-icon icon="upload"></b-icon>
          <span>Upload CSV</span>
        </a>
      </b-upload>
    </b-field>

    <div v-for="source in project.sources" :key="source.id" class="sources-list">
      <article class="card">
        <header class="card-header">
          <h2 class="card-header-title">{{ source.name }}</h2>
          <b-button icon-left="trash-can-outline"></b-button>
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
                    <TableTag v-for="rule in columnRules(column)" :key="rule.id" :table="rule.table">
                      {{ rule.table.name }} > {{ rule.property }}
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
import { Project, ProjectId, Rule, Table, Source } from '../../types'

@Component({
  components: {
    TableTag
  }
})
export default class ProjectDataView extends Vue {
  get projectId (): ProjectId {
    return this.$route.params.id
  }

  get project (): Project {
    const remoteProject = this.$store.getters['projects/one'](this.projectId)
    // Assume project is loaded because we're in a nested view
    return remoteProject.data
  }

  uploadSource (file: File) {
    this.$store.dispatch('projects/uploadSource', {
      project: this.project,
      file
    })
  }

  columnRules (column: any) {
    const columnId = column.field
    const rules = this.project.rules.filter((rule) => rule.columns.includes(columnId))
    return rules.map((rule) => {
      const table = this.project.tables.find(({ id }) => id === rule.table)
      return {
        ...rule,
        table
      }
    })
  }
}
</script>
