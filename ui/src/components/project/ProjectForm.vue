<template>
  <form class="modal-card" @submit.prevent="save(project)">
    <header class="modal-card-head">
      <h3 class="modal-card-title">{{ title }}</h3>
    </header>
    <section class="modal-card-body">
      <b-field label="Name">
        <b-input v-model="project.name" />
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
import { Project, Table, Source } from '../../types'
import TableTag from '../TableTag.vue'

@Component
export default class extends Vue {
  @Prop({ default: emptyProject }) project: Project;
  @Prop() save: (project: Project) => any;

  get title () {
    if (this.project.id) {
      return 'Edit project'
    } else {
      return 'Create project'
    }
  }
}

function emptyProject (): Project {
  return {
    id: '',
    name: '',
    tables: [],
    sources: []
  }
}
</script>
