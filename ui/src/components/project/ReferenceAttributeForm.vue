<template>
  <form action="" class="modal-card" @submit.prevent="save(attribute)">
    <header class="modal-card-head">
      <h3 class="modal-card-title">
        {{ title }}
        <TableTag :table="table" class="is-large" />
      </h3>
    </header>
    <section class="modal-card-body">
      <b-field label="Table">
        <b-select v-model="attribute.referencedTableId">
          <option v-for="table in tables" :key="table.id" :value="table.id">{{ table.name }}</option>
        </b-select>
      </b-field>

      <b-field label="Property">
        <b-input type="text" v-model="attribute.predicateId" required />
      </b-field>

      <b-field label="Identifier columns mapping" v-if="referencedTable" :addons="false">
        <p class="help">
          The identifier for <TableTag :table="referencedTable" /> is defined as <code>{{ referencedTable.identifierTemplate }}</code><br>
          Which columns should be used to reference it?
        </p>
        <table class="table">
          <thead>
            <tr>
              <th>Identifier column</th>
              <th>Link column</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mapping, index) in attribute.columnMapping" :key="index">
              <td>{{ mapping.referencedColumnName }}</td>
              <td>
                <b-select v-model="mapping.sourceColumnId">
                  <option v-for="column in source.columns" :key="column.id" :value="column.id">{{ column.name }}</option>
                </b-select>
              </td>
            </tr>
          </tbody>
        </table>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary">Save</button>
    </footer>
  </form>
</template>

<script lang="ts">
import { Prop, Component, Vue, Watch } from 'vue-property-decorator'
import { Table, ResourceId, Source, ReferenceAttributeFormData } from '@/types'
import TableTag from '../TableTag.vue'

@Component({
  components: {
    TableTag
  }
})
export default class extends Vue {
  @Prop({ default: emptyAttribute }) readonly attribute: ReferenceAttributeFormData;
  @Prop() readonly table: Table;
  @Prop() readonly source: Source;
  @Prop() readonly tables: Table[];
  @Prop() readonly save: (attribute: ReferenceAttributeFormData) => void;

  get title () {
    if (this.attribute.id) {
      return 'Edit attribute on'
    } else {
      return 'Create attribute on'
    }
  }

  get columnLabel () {
    return `Column from ${this.source.name}`
  }

  get needsColumnMapping (): boolean {
    if (!this.referencedTable) return false

    return this.table.sourceId !== this.referencedTable.sourceId
  }

  get referencedTable (): Table | null {
    const id = this.attribute.referencedTableId

    if (id === '') return null

    return this.tables.find((t) => t.id === id) || null
  }

  @Watch('referencedTable')
  populatePredicate (table: Table | null) {
    if (!table) return

    if (!this.attribute.predicateId) {
      this.attribute.predicateId = table.name.toLowerCase()
    }
  }

  @Watch('referencedTable')
  populateColumnMapping (table: Table | null) {
    if (!table) return

    // TODO: try to auto-map by name
    this.attribute.columnMapping = table.identifierColumns.map((column) => ({
      referencedColumnId: column.id,
      referencedColumnName: column.name,
      sourceColumnId: ''
    }))
  }
}

function emptyAttribute () {
  return {
    referencedTableId: '',
    predicateId: '',
    columnMapping: []
  }
}
</script>
