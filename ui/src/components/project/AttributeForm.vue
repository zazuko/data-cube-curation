<template>
  <form action="" class="modal-card" @submit.prevent="save(attribute)">
    <header class="modal-card-head">
      <h3 class="modal-card-title">
        {{ title }}
        <TableTag :table="table" class="is-large" />
      </h3>
    </header>
    <section class="modal-card-body">
      <b-field label="Name">
        <b-input type="text" v-model="attribute.name" required />
      </b-field>

      <b-field label="Property">
        <b-input type="text" v-model="attribute.predicateId" required />
      </b-field>

      <b-field :label="columnLabel">
        <b-select v-model="attribute.columnId" expanded required>
          <option v-for="column in source.columns" :value="column.id" :key="column.id">{{ column.name }}</option>
        </b-select>
      </b-field>

      <b-field label="Type">
        <b-input type="text" v-model="attribute.dataTypeId" :disabled="attribute.language !== ''" />
      </b-field>

      <b-field label="Language">
        <b-autocomplete
          v-model="attribute.language"
          :disabled="attribute.dataTypeId !== ''"
          :data="languages"
        />
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary">Save</button>
    </footer>
  </form>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { Table, ResourceId, Source } from '../../types'
import TableTag from '../TableTag.vue'

interface AttributeFormData {
  id?: ResourceId,
  name: string,
  columnId: ResourceId,
  predicateId: ResourceId,
  dataTypeId: string,
  language: string
}

@Component({
  components: {
    TableTag
  }
})
export default class extends Vue {
  @Prop({ default: emptyAttribute }) readonly attribute: AttributeFormData;
  @Prop() readonly table: Table;
  @Prop() readonly source: Source;
  @Prop() readonly save: (attribute: AttributeFormData) => void;

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

  get languages () {
    return [
      '',
      'fr',
      'de'
    ]
  }
}

function emptyAttribute () {
  return {
    name: '',
    columnId: '',
    predicateId: '',
    dataTypeId: '',
    language: ''
  }
}
</script>
