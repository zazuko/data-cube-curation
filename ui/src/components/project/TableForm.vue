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

      <b-field label="Source CSV file">
        <b-select v-model="table.sourceId" placeholder="Select a source" required>
          <option v-for="source in sources" :key="source.id" :value="source.id">
            {{ source.name }}
          </option>
        </b-select>
      </b-field>

      <IdentifierTemplateField
        v-model="table.identifierTemplate"
        :project="project"
        :tableName="table.name"
        :source="source"
        v-if="table.type != 'fact'"
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
import { Project, Source, TableFormData } from '@/types'
import IdentifierTemplateField from '../IdentifierTemplateField.vue'

@Component({
  components: {
    IdentifierTemplateField
  }
})
export default class TableForm extends Vue {
  @Prop({ default: emptyTable }) readonly table: TableFormData;
  @Prop() readonly project: Project;
  @Prop() readonly sources: Source[];
  @Prop() readonly save: (table: TableFormData) => void;

  mounted () {
    if (!this.table.type) {
      if (this.project.actions.createFactTable) {
        this.table.type = 'fact'
      } else {
        this.table.type = 'dimension'
      }
    }

    if (!this.table.sourceId && this.sources.length === 1) {
      this.table.sourceId = this.sources[0].id
    }
  }

  get title () {
    if (this.table.id) {
      return 'Edit table'
    } else {
      return 'Create table'
    }
  }

  get source () {
    if (!this.table.sourceId) return null

    return this.sources.find((source) => source.id === this.table.sourceId)
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
