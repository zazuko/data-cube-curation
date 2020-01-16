<template>
  <form action="" class="modal-card" @submit.prevent="save(attribute)">
    <header class="modal-card-head">
      <h3 class="modal-card-title">
        {{ operation.title }}
      </h3>
    </header>
    <section class="modal-card-body reference-form">
      <p>
        On table <TableTag :table="table" class="is-medium" />,
      </p>
      <p>
        create a link to the <label for="referenced-table"><strong>category table</strong></label>
      </p>
      <b-field>
        <b-select v-model="attribute.referencedTableId" id="referenced-table">
          <option v-for="table in linkableTables" :key="table.id" :value="table.id">{{ table.name }}</option>
        </b-select>
      </b-field>
      <p>
        using the <label for="property"><strong>property</strong></label>
      </p>
      <PropertyField :project="project" v-model="attribute.property" required />

      <div v-if="referencedTable" v-show="attribute.columnMapping.length > 0">
        <p>
          The identifier <code>{{ referencedTable.identifierTemplate }}</code> shall use
          the columns
        </p>
        <table class="table columns-table">
          <tbody>
            <tr v-for="(mapping, index) in attribute.columnMapping" :key="index">
              <td>
                <b-select v-model="mapping.sourceColumnId">
                  <option v-for="column in source.columns" :key="column.id" :value="column.id">{{ column.name }}</option>
                </b-select>
              </td>
              <td>for <code>{{ mapping.referencedColumnName }}</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary">Save</button>
    </footer>
  </form>
</template>

<style scoped>
.reference-form p {
  margin-bottom: 1em;
}

.columns-table > tbody > tr > td {
  padding: 0;
}

.columns-table > tbody > tr > td:first-child {
  padding-right: 0.4em;
}

.columns-table > tbody > tr > td:last-child {
  line-height: 2em;
}
</style>

<script lang="ts">
import { Prop, Component, Vue, Watch } from 'vue-property-decorator'
import { IOperation } from 'alcaeus/types/Resources'
import { Project, Table, ResourceId, Source, Column, ReferenceAttributeFormData } from '@/types'
import TableTag from '../TableTag.vue'
import PropertyField from '../PropertyField.vue'

@Component({
  components: {
    PropertyField,
    TableTag
  }
})
export default class extends Vue {
  @Prop({ default: emptyAttribute }) readonly attribute: ReferenceAttributeFormData;
  @Prop() readonly operation: IOperation;
  @Prop() readonly project: Project;
  @Prop() readonly table: Table;
  @Prop() readonly source: Source;
  @Prop() readonly tables: Table[];
  @Prop() readonly sources: Source[];
  @Prop() readonly save: (attribute: ReferenceAttributeFormData) => void;

  get linkableTables () {
    return this.tables.filter((table) => !table.isFact)
  }

  get referencedTable (): Table | null {
    const id = this.attribute.referencedTableId

    if (id === '') return null

    return this.tables.find((t) => t.id === id) || null
  }

  @Watch('referencedTable')
  populatePredicate (table: Table | null) {
    if (!table) return

    if (!this.attribute.property) {
      this.attribute.property = table.name.toLowerCase()
    }
  }

  @Watch('referencedTable')
  populateColumnMapping (table: Table | null) {
    if (!table) return

    const referencedSource = this.sources.find((s) => s.id === table.sourceId)
    if (!referencedSource) throw new Error(`Source ${table.sourceId} not found`)

    this.attribute.columnMapping = table.identifierColumns.map((column) => ({
      referencedColumnId: column.id,
      referencedColumnName: column.name,
      sourceColumnId: guessMappedColumn(column, referencedSource, this.source)
    }))
  }
}

function emptyAttribute () {
  return {
    referencedTableId: '',
    property: '',
    columnMapping: []
  }
}

function guessMappedColumn (referencedColumn: Column, referencedSource: Source, tableSource: Source): ResourceId {
  if (tableSource.id === referencedSource.id) {
    return referencedColumn.id
  } else {
    const guess = tableSource.columns.find((c) => c.name === referencedColumn.name)
    return guess ? guess.id : ''
  }
}
</script>
