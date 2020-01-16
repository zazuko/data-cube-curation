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
        <b-select v-model="attribute.columnId" expanded required>
          <option v-for="column in source.columns" :value="column.id" :key="column.id">{{ column.name }}</option>
        </b-select>
      </b-field>

      <b-field label="Property">
        <b-input type="text" v-model="attribute.property" required />
      </b-field>

      <b-field label="Type">
        <b-input type="text" v-model="attribute.dataTypeId" :disabled="attribute.language !== ''" />
      </b-field>

      <b-field label="Language">
        <LanguageInput v-model="attribute.language" :disabled="attribute.dataTypeId !== ''" />
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
import { Table, ResourceId, Source, ValueAttributeFormData } from '@/types'
import TableTag from '../TableTag.vue'
import LanguageInput from '../LanguageInput.vue'

@Component({
  components: {
    TableTag,
    LanguageInput
  }
})
export default class extends Vue {
  @Prop({ default: emptyAttribute }) readonly attribute: ValueAttributeFormData;
  @Prop() readonly table: Table;
  @Prop() readonly source: Source;
  @Prop() readonly save: (attribute: ValueAttributeFormData) => void;

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
    dataTypeId: '',
    language: ''
  }
}
</script>
