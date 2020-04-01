<template>
  <form action="" class="modal-card" @submit.prevent="save(table, attributes)">
    <header class="modal-card-head">
      <h3 class="modal-card-title">Create table from columns</h3>
    </header>
    <section class="modal-card-body">
      <b-field>
        <b-radio v-model="table.type" native-value="fact" :disabled="!project.actions.createFactTable">
          Fact table
        </b-radio>
        <b-radio v-model="table.type" native-value="dimension" :disabled="!project.actions.createDimensionTable">
          Dimension table
        </b-radio>
      </b-field>

      <div class="columns">
        <div class="column">
        <b-field label="Name">
          <b-input type="text" v-model="table.name" required />
        </b-field>
        </div>

        <div class="column is-3">
          <b-field label="Display color">
            <div class="control has-icons-right is-clearfix">
              <input type="text" v-model="table.color" class="input" disabled>
              <span class="icon is-right" :style="{ color: table.color }">
                <i class="mdi mdi-circle mdi-24px"></i>
              </span>
            </div>
          </b-field>
        </div>
      </div>

      <IdentifierTemplateField
        v-model="table.identifierTemplate"
        :project="project"
        :tableName="table.name"
        :source="source"
      />

      <b-field label="Attributes">
        <table class="table is-narrow is-fullwidth">
          <thead>
            <tr>
              <th>CSV Column</th>
              <th>Property</th>
              <th>Data type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(attribute, index) in attributes" :key="attribute.trackingId">
              <td>
                <MultiSelect
                  v-model="attribute.columnId"
                  :options="source.columns.map((c) => c.id)"
                  :custom-label="(id) => source.columns.find((c) => c.id == id).name"
                  required
                />
              </td>
              <td>
                <PropertyField :project="project" v-model="attribute.property" required />
              </td>
              <td>
                <DataTypeField v-model="attribute.dataType" />
              </td>
              <td>
                <b-button type="is-white" icon-left="times-circle" title="Remove attribute" @click="removeAttribute(index)" />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5">
                <b-button type="is-white" icon-left="plus-circle" title="Add attribute" @click="addAttribute" />
              </td>
            </tr>
          </tfoot>
        </table>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary">Save</button>
    </footer>
  </form>
</template>

<style scoped>
.modal-card {
  width: 100%;
  min-width: 830px;
}
</style>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import nanoid from 'nanoid'
import { TableType, ResourceId, Project, Source, TableFormData, ValueAttributeFormData } from '@/types'
import * as datatypes from '@/datatypes'
import DataTypeField from '../DataTypeField.vue'
import IdentifierTemplateField from '../IdentifierTemplateField.vue'
import LanguageInput from '../LanguageInput.vue'
import PropertyField from '../PropertyField.vue'

@Component({
  components: {
    DataTypeField,
    IdentifierTemplateField,
    LanguageInput,
    PropertyField,
  },
})
export default class TableForm extends Vue {
  @Prop() readonly project: Project
  @Prop() readonly source: Source
  @Prop() readonly columns: ResourceId[]
  @Prop() readonly save: (table: TableFormData, attributes: ValueAttributeFormData[]) => void
  table: TableFormData = emptyTable()
  attributes: ValueAttributeFormData[] = []

  mounted () {
    if (!this.table.type) {
      if (this.project.actions.createFactTable) {
        this.table.type = 'fact'
      } else {
        this.table.type = 'dimension'
      }
    }

    this.table.sourceId = this.source.id

    this.attributes = this.columns.map((columnId) =>
      emptyAttribute({
        columnId: columnId,
        property: this.getColumnSlug(columnId),
      }))
  }

  getColumnSlug (columnId: ResourceId): string {
    return columnId.split('/').slice(-1)[0]
  }

  addAttribute () {
    this.attributes.push(emptyAttribute())
  }

  removeAttribute (index: number) {
    this.attributes.splice(index, 1)
  }
}

function emptyTable () {
  const tableType: TableType = 'fact'

  return {
    type: tableType,
    name: '',
    color: '',
    identifierTemplate: '',
    sourceId: '',
  }
}

function emptyAttribute (attrs = {}) {
  return {
    // Artificial unique ID to avoid the default Vue behavior of reusing
    // components for the same index when deleting a table row
    trackingId: nanoid(),

    property: '',
    dataType: {
      id: datatypes.defaultURI,
      params: {},
    },
    columnId: '',
    ...attrs,
  }
}

</script>
