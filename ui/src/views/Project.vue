<template>
  <div id="project-page">
    <Loader :data="project" v-slot="{ data: loadedProject }">
      <h2 class="title">{{ loadedProject.name }}</h2>
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
}
</script>
