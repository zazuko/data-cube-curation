<template>
  <div id="project-page">
    <Loader :data="project" v-slot="{ data: loadedProject }">
      <h2 class="title">{{ loadedProject.name }}</h2>

      <b-field class="file">
        <b-upload @input="uploadSource" accept=".csv">
          <a class="button is-primary">
            <b-icon icon="upload"></b-icon>
            <span>Upload CSV</span>
          </a>
        </b-upload>
      </b-field>

      <b-table :data="loadedProject.sources" :columns="sourcesColumns">
        <template slot-scope="props">
          <b-table-column field="name" label="Name">
            <router-link :to="{ name: 'project', params: { id: props.row.id } }">
              {{ props.row.name }}
            </router-link>
          </b-table-column>
          <b-table-column field="id" label="ID">
            {{ props.row.id }}
          </b-table-column>
          <b-table-column field label="Actions"></b-table-column>
        </template>
        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>You don't have any sources yet.</p>
            </div>
          </section>
        </template>
      </b-table>
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
