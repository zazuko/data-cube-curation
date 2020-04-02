<template>
  <form action="" class="modal-card" @submit.prevent="save(operation, data)">
    <header class="modal-card-head">
      <h3 class="modal-card-title">{{ operation.title }}</h3>
    </header>
    <section class="modal-card-body">
      <b-field v-if="isCreation">
        <b-radio v-model="data.type" native-value="fact" :disabled="!project.actions.createFactTable">
          Fact table
        </b-radio>
        <b-radio v-model="data.type" native-value="dimension" :disabled="!project.actions.createDimensionTable">
          Dimension table
        </b-radio>
      </b-field>

      <div class="columns">
        <div class="column">
        <b-field label="Name">
          <b-input type="text" v-model="data.name" required />
        </b-field>
        </div>

        <div class="column is-3">
          <b-field label="Display color">
            <div class="control has-icons-right is-clearfix">
              <input type="text" v-model="data.color" class="input" disabled>
              <span class="icon is-right" :style="{ color: data.color }">
                <i class="mdi mdi-circle mdi-24px"></i>
              </span>
            </div>
          </b-field>
        </div>
      </div>

      <b-field label="Source CSV file" v-if="isCreation">
        <b-select v-model="data.sourceId" placeholder="Select a source" required>
          <option v-for="source in sources" :key="source.id" :value="source.id">
            {{ source.name }}
          </option>
        </b-select>
      </b-field>

      <IdentifierTemplateField
        v-model="data.identifierTemplate"
        :project="project"
        :table="data"
        :source="source"
        :autopopulate="isCreation"
      />
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary">Save</button>
    </footer>
  </form>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { IOperation } from 'alcaeus/types/Resources'
import { Project, Source, Table, TableFormData } from '@/types'
import IdentifierTemplateField from '../IdentifierTemplateField.vue'

@Component({
  components: {
    IdentifierTemplateField,
  },
})
export default class TableForm extends Vue {
  @Prop() readonly table: Table | null;
  @Prop() readonly project: Project;
  @Prop() readonly sources: Source[];
  @Prop() readonly save: (operation: IOperation, data: TableFormData) => void;
  data: TableFormData = emptyTable();

  created () {
    if (this.table) {
      this.data = this.table.getData({})
    }

    if (!this.data.sourceId && this.sources.length === 1) {
      this.data.sourceId = this.sources[0].id
    }

    if (!this.data.type) {
      if (this.project.actions.createFactTable) {
        this.data.type = 'fact'
      } else {
        this.data.type = 'dimension'
      }
    }
  }

  get title () {
    return this.isCreation ? 'Create table' : 'Edit table'
  }

  get isCreation () {
    return !this.table
  }

  get source () {
    if (!this.data.sourceId) return null

    return this.sources.find((source) => source.id === this.data.sourceId)
  }

  get operation () {
    if (this.table) {
      return this.table.actions.edit
    } else {
      return this.data.type === 'fact'
        ? this.project.actions.createFactTable
        : this.project.actions.createDimensionTable
    }
  }
}

function emptyTable () {
  return {
    type: null,
    name: '',
    color: '',
    identifierTemplate: '',
    sourceId: '',
  }
}
</script>
