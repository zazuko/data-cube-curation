<template>
  <form class="modal-card" @submit.prevent="save(data)">
    <header class="modal-card-head">
      <h3 class="modal-card-title">{{ operation.title }}</h3>
    </header>
    <section class="modal-card-body">
      <b-field label="Name">
        <b-input v-model="data.name" required />
      </b-field>
      <b-field label="Base URI" message="Default prefix for tables and properties">
        <b-input v-model="data.baseUri" placeholder="https://my-project.example.org" />
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
import { IOperation } from 'alcaeus/types/Resources'
import { Project, ProjectFormData } from '@/types'

@Component
export default class extends Vue {
  @Prop() operation: IOperation;
  @Prop() project: Project | null;
  @Prop() save: (project: ProjectFormData) => void;
  data: ProjectFormData = emptyProject();

  mounted () {
    if (this.project) {
      this.data = {
        name: this.project.name,
        baseUri: this.project.baseUri
      }
    }
  }
}

function emptyProject (): ProjectFormData {
  return {
    name: '',
    baseUri: ''
  }
}
</script>
