<template>
  <article class="card">
    <header class="card-header has-background-light">
      <h2 class="card-header-title">{{ source.name }}</h2>
      <div class="card-header-icon">
        <b-button icon-left="plus" @click="createTable" :disabled="selectedColumns.length < 1">
          Create table from selected columns
        </b-button>
        <b-button icon-left="trash-can-outline" v-if="source.actions.delete"></b-button>
      </div>
    </header>
    <section class="card-content">
      <table class="table is-fullwidth is-bordered is-striped is-narrowed source-table">
        <thead>
          <tr>
            <th v-for="column in source.columns" :key="column.id">
              <b-field>
                <b-checkbox v-model="selectedColumns" :native-value="column.id">
                  {{ column.name }}
                </b-checkbox>
              </b-field>
              <b-taglist>
                <TableTag v-for="attribute in columnAttributes(column)" :key="attribute.id" :table="getTable(attribute.tableId)">
                  {{ getTable(attribute.tableId).name }} > {{ attribute.predicateId }}
                </TableTag>
              </b-taglist>
            </th>
          </tr>
        </thead>
        <Loader tag="tbody" :data="sampleData" v-slot="{ data: sampleData }">
          <tr v-for="(row, index) in sampleData" :key="index">
            <td v-for="(cell, index) in row" :key="index">{{ cell }}</td>
          </tr>
          <tr v-if="sampleData.length < 1" class="has-text-grey">
            <td :colspan="source.columns.length">No data</td>
          </tr>
        </Loader>
      </table>
    </section>
    <footer class="card-footer">
      <b-button icon-right="chevron-double-down" class="is-fullwidth" disabled>
        Show more
      </b-button>
    </footer>
  </article>
</template>

<style scoped>
.source-table > tbody > tr > td {
  font-family: monospace;
  font-size: 0.8rem;
  white-space: nowrap;
}
</style>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { Project, ResourceId, Table, Source, RemoteData, Attribute, Column, TableFormData, AttributeFormData } from '@/types'
import TableTag from '@/components/TableTag.vue'
import Loader from '@/components/Loader.vue'
import TableAdvancedForm from '@/components/project/TableAdvancedForm.vue'

@Component({
  components: {
    TableTag,
    Loader
  }
})
export default class extends Vue {
  @Prop() readonly project: Project
  @Prop() readonly source: Source
  @Prop() readonly tables: Table[]
  selectedColumns: string[] = []

  created () {
    this.$store.dispatch('sourcesData/loadForSource', this.source)
  }

  get sampleData () {
    return this.$store.getters['sourcesData/forSource'](this.source.id)
  }

  get sourceAttributes (): RemoteData<Attribute[]> {
    return this.$store.getters['attributes/forTables'](this.tables)
  }

  getTable (id: ResourceId): Table {
    const table = this.tables.find((table) => table.id === id)

    if (!table) throw new Error(`Table with ID ${id} not found`)

    return table
  }

  columnAttributes (column: Column) {
    if (this.sourceAttributes.isLoading || !this.sourceAttributes.data) return []

    return this.sourceAttributes.data.filter((attribute) => attribute.columnId === column.id)
  }

  createTable () {
    const modal = this.$buefy.modal.open({
      parent: this,
      component: TableAdvancedForm,
      props: {
        project: this.project,
        source: this.source,
        columns: this.selectedColumns,
        save: async (table: TableFormData, attributes: AttributeFormData[]) => {
          const loading = this.$buefy.loading.open({})
          await this.$store.dispatch('tables/createWithAttributes', { project: this.project, table, attributes })
          this.selectedColumns = []
          modal.close()
          loading.close()
        }
      },
      hasModalCard: true
    })
  }
}
</script>
