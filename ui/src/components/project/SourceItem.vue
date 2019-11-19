<template>
  <article class="card">
    <header class="card-header has-background-light">
      <h2 class="card-header-title">{{ source.name }}</h2>
      <div class="card-header-icon">
        <b-button icon-left="trash-can-outline" v-if="source.actions.delete"></b-button>
      </div>
    </header>
    <section class="card-content">
      <table class="table is-fullwidth is-bordered is-striped is-narrowed source-table">
        <thead>
          <tr>
            <th v-for="column in source.columns" :key="column.id">
              {{ column.name }}
              <b-taglist>
                <TableTag v-for="attribute in columnAttributes(column)" :key="attribute.id" :table="getTable(attribute.tableId)">
                  {{ getTable(attribute.tableId).name }} > {{ attribute.name }}
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
import { Project, ResourceId, Table, Source, RemoteData, Attribute, Column } from '@/types'
import TableTag from '@/components/TableTag.vue'
import Loader from '@/components/Loader.vue'

@Component({
  components: {
    TableTag,
    Loader
  }
})
export default class extends Vue {
  @Prop() readonly source: Source
  @Prop() readonly tables: Table[]

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
}
</script>
