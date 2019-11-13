<template>
  <form action="" class="modal-card" @submit.prevent="save(table)">
    <header class="modal-card-head">
      <h3 class="modal-card-title">{{ title }}</h3>
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

      <b-field label="Name">
        <b-input type="text" v-model="table.name" required />
      </b-field>

      <b-field label="Display color">
        <div class="control has-icons-right is-clearfix">
          <input type="text" v-model="table.color" class="input" disabled>
          <span class="icon is-right" :style="{ color: table.color }">
            <i class="mdi mdi-circle mdi-24px"></i>
          </span>
        </div>
      </b-field>

      <b-field label="Source CSV file">
        <b-select v-model="table.sourceId" placeholder="Select a source" required>
          <option v-for="source in project.sources" :key="source.id" :value="source.id">
            {{ source.name }}
          </option>
        </b-select>
      </b-field>

      <b-field label="Identifier attribute template" v-if="table.type != 'fact'">
        <b-input type="text" v-model="table.identifierTemplate" placeholder="http://example.org/{column_id}" required />
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
import { TableType, ResourceId, Project } from '../../types'

interface TableFormData {
  id?: ResourceId,
  type: TableType,
  name: string,
  color: string,
  identifierTemplate: string,
  sourceId: ResourceId,
}

@Component
export default class TableForm extends Vue {
  @Prop({ default: emptyTable }) readonly table: TableFormData;
  @Prop() readonly project: Project;
  @Prop() readonly save: (table: TableFormData) => void;

  mounted () {
    if (!this.table.type) {
      if (this.project.actions.createFactTable) {
        this.table.type = 'fact'
      } else {
        this.table.type = 'dimension'
      }
    }
  }

  get title () {
    if (this.table.id) {
      return 'Edit table'
    } else {
      return 'Create table'
    }
  }
}

function emptyTable () {
  return {
    type: '',
    name: '',
    color: '',
    identifierTemplate: '',
    sourceId: ''
  }
}
</script>
