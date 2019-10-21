<template>
  <div id="project-page">
    <Loader :data="project" v-slot="{ data: loadedProject }">
      <h2 class="title">{{ loadedProject.name }}</h2>

      <b-table :data="loadedProject.sources" :columns="sourcesColumns"></b-table>

      <b-field class="file">
        <b-upload @input="uploadSource" accept=".csv">
          <a class="button is-primary">
            <b-icon icon="upload"></b-icon>
            <span>Upload CSV</span>
          </a>
        </b-upload>
      </b-field>
    </Loader>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Project, RemoteData } from '../types';
import Loader from '../components/Loader.vue';

@Component({
  components: {
    Loader,
  },
})
export default class ProjectView extends Vue {
  sourcesColumns = [
    {label: 'Name', field: 'name'},
    {label: 'ID', field: 'id'},
  ];

  get projectId() {
    return this.$route.params.id;
  }

  get project(): RemoteData<Project> {
    return this.$store.getters['projects/one'](this.projectId);
  }

  created() {
    this.$store.dispatch('projects/loadOne', this.projectId);
  }

  uploadSource(file) {
    this.$store.dispatch('projects/uploadSource', {
      project: this.project.data,
      file: file,
    });
  }
}
</script>
