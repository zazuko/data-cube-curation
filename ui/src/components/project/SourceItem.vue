<template>
  <article class="card">
    <header class="card-header has-background-light">
      <h2 class="card-header-title">{{ source.name }}</h2>
      <div class="card-header-icon">
        <b-button icon-left="plus" @click="createTable" :disabled="selectedColumns.length < 1">
          Create table from selected columns
        </b-button>
        <b-dropdown position="is-bottom-left">
          <button class="button is-text" slot="trigger">
            <b-icon icon="ellipsis-h"></b-icon>
          </button>
          <b-dropdown-item v-if="source.actions.edit" @click="editSource(source, source.actions.edit)">
            <b-icon icon="cog" size="is-small" />
            <span>{{ source.actions.edit.title }}</span>
          </b-dropdown-item>
          <b-dropdown-item v-if="source.actions.delete" @click="deleteSource(source)" class="has-text-danger">
            <b-icon icon="trash" size="is-small" />
            <span>{{ source.actions.delete.title }}</span>
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </header>
    <section class="card-content">
      <table class="table is-fullwidth is-bordered is-striped is-narrowed source-table">
        <thead>
          <tr>
            <th v-for="(column, index) in source.columns" :key="column.id" :class="{ 'is-collapsed': !showColumn(index) }">
              <div v-if="showColumn(index)">
                <b-field>
                  <b-checkbox v-model="selectedColumns" :native-value="column.id">
                    {{ column.name }}
                  </b-checkbox>
                </b-field>
                <Loader class="tags" :data="tables" v-slot="{ data: tables }">
                  <TableTag v-for="attribute in columnAttributes(column)" :key="attribute.id" :table="findTable(tables, attribute.tableId)">
                    {{ findTable(tables, attribute.tableId).name }} > <PrefixedURI :uri="attribute.property" :project="project" />
                  </TableTag>
                </Loader>
              </div>
              <span v-else>·</span>
            </th>
          </tr>
        </thead>
        <Loader tag="tbody" :data="sampleData" v-slot="{ data: sampleData }">
          <tr v-for="(row, rowIndex) in sampleData" :key="rowIndex">
            <td v-for="(cell, colIndex) in row" :key="colIndex" :class="{ 'is-collapsed': !showColumn(colIndex) }">
              <span v-show="showColumn(colIndex)">
                {{ cell }}
              </span>
            </td>
          </tr>
          <tr v-if="sampleData.length < 1" class="has-text-grey">
            <td :colspan="source.columns.length">No data</td>
          </tr>
        </Loader>
      </table>
    </section>
    <footer class="card-footer">
      <b-button icon-right="chevron-down" class="is-fullwidth" disabled>
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

th.is-collapsed,
td.is-collapsed {
  padding-left: 0;
  padding-right: 0;
  color: transparent;
}
</style>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { IOperation } from 'alcaeus/types/Resources'
import {
  Project,
  ResourceId,
  Table,
  Source,
  SourceFormData,
  RemoteData,
  Attribute,
  Column,
  TableFormData,
  ValueAttributeFormData,
  SourceColumnFilter,
} from '@/types'
import Remote from '@/remote'
import TableTag from '@/components/TableTag.vue'
import PrefixedURI from '@/components/PrefixedURI.vue'
import Loader from '@/components/Loader.vue'
import TableAdvancedForm from '@/components/project/TableAdvancedForm.vue'
import SourceForm from '@/components/project/SourceForm.vue'

@Component({
  components: {
    TableTag,
    PrefixedURI,
    Loader,
  },
})
export default class extends Vue {
  @Prop() readonly project: Project
  @Prop() readonly source: Source
  @Prop() readonly tables: RemoteData<Table[]>
  @Prop() readonly columnFilter: SourceColumnFilter
  selectedColumns: string[] = []

  created () {
    this.$store.dispatch('sourcesData/loadForSource', this.source)
  }

  get sampleData () {
    return this.$store.getters['sourcesData/forSource'](this.source.id)
  }

  get sourceAttributes (): RemoteData<Attribute[]> {
    if (this.tables.isLoading) return Remote.loading()

    return this.$store.getters['attributes/forTables'](this.tables.data)
  }

  findTable (tables: Table[], id: ResourceId): Table {
    const table = tables.find((table) => table.id === id)

    if (!table) throw new Error(`Table with ID ${id} not found`)

    return table
  }

  columnAttributes (column: Column) {
    if (this.sourceAttributes.isLoading || !this.sourceAttributes.data) return []

    return this.sourceAttributes.data.filter((attribute) => attribute.columnId === column.id)
  }

  showColumn (index: number) {
    const column = this.source.columns[index]
    const isMapped = this.columnAttributes(column).length > 0

    return (
      this.columnFilter === 'all' ||
      (this.columnFilter === 'mapped' && isMapped) ||
      (this.columnFilter === 'not-mapped' && !isMapped)
    )
  }

  createTable () {
    const modal = this.$buefy.modal.open({
      parent: this,
      component: TableAdvancedForm,
      props: {
        project: this.project,
        source: this.source,
        columns: this.selectedColumns,
        save: async (operation: IOperation, data: TableFormData, attributes: ValueAttributeFormData[]) => {
          const loading = this.$buefy.loading.open({})
          try {
            await this.$store.dispatch('tables/createWithAttributes', {
              project: this.project,
              operation,
              data,
              attributes,
            })
            this.selectedColumns = []
            modal.close()
          } finally {
            loading.close()
          }
        },
      },
      hasModalCard: true,
    })
  }

  deleteSource (source: Source) {
    this.$buefy.dialog.confirm({
      title: (source.actions.delete as IOperation).title,
      message: 'Are you sure you want to delete this source?',
      confirmText: 'Delete',
      type: 'is-danger',
      hasIcon: true,
      onConfirm: async () => {
        const loading = this.$buefy.loading.open({})
        try {
          await this.$store.dispatch('sources/delete', source)
        } finally {
          loading.close()
        }
      },
    })
  }

  editSource (source: Source, operation: IOperation) {
    const modal = this.$buefy.modal.open({
      parent: this,
      component: SourceForm,
      props: {
        source: source,
        operation: operation,
        save: async (data: SourceFormData) => {
          const loading = this.$buefy.loading.open({})
          try {
            await this.$store.dispatch('sources/update', { project: this.project, operation, data })
            modal.close()
          } finally {
            loading.close()
          }
        },
      },
      hasModalCard: true,
    })
  }
}
</script>
