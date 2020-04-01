<template>
  <form action="" class="modal-card" @submit.prevent="save(attribute)">
    <header class="modal-card-head">
      <h3 class="modal-card-title">
        {{ title }}
        <TableTag :table="table" class="is-large" />
      </h3>
    </header>
    <section class="modal-card-body">
      <b-field :label="columnLabel">
        <MultiSelect
          v-model="attribute.columnId"
          :options="source.columns.map((c) => c.id)"
          :custom-label="(id) => source.columns.find((c) => c.id == id).name"
          required
        />
      </b-field>

      <PropertyField :project="project" label="Property" v-model="attribute.property" required />

      <DataTypeField v-model="attribute.dataType" label="Data type" />
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary">Save</button>
    </footer>
  </form>
</template>

<script lang="ts">
import { Prop, Component, Vue, Watch } from 'vue-property-decorator'
import { Project, Table, ResourceId, Source, ValueAttributeFormData } from '@/types'
import * as datatypes from '@/datatypes'
import TableTag from '../TableTag.vue'
import DataTypeField from '../DataTypeField.vue'
import LanguageInput from '../LanguageInput.vue'
import PropertyField from '../PropertyField.vue'

@Component({
  components: {
    TableTag,
    DataTypeField,
    LanguageInput,
    PropertyField,
  },
})
export default class extends Vue {
  @Prop({ default: emptyAttribute }) readonly attribute: ValueAttributeFormData;
  @Prop() readonly project: Project;
  @Prop() readonly table: Table;
  @Prop() readonly source: Source;
  @Prop() readonly save: (attribute: ValueAttributeFormData) => void;
  vocabularies = [];

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

  @Watch('attribute.columnId')
  populatePredicate (columnId: ResourceId) {
    if (!this.attribute.property) {
      this.attribute.property = columnId.split('/').slice(-1)[0]
    }
  }
}

function emptyAttribute () {
  return {
    columnId: '',
    property: '',
    dataType: {
      id: datatypes.defaultURI,
      params: {},
    },
  }
}
</script>
