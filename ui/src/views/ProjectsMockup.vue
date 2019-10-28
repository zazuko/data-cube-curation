<template>
  <div id="projects-page">
    <h2 class="title is-2">My projects</h2>

    <div class="actions">
      <b-button type="is-primary" icon-left="plus">
        New project
      </b-button>
    </div>

    <b-table :data="projects">
      <template slot-scope="props">
        <b-table-column field="name" label="Name">
          <router-link :to="{ name: 'project', params: { id: props.row.id } }">
            {{ props.row.name }}
          </router-link>
        </b-table-column>
        <b-table-column field label="">
          <div class="buttons">
            <b-button icon-left="pencil"></b-button>
            <b-button icon-left="trash-can-outline"></b-button>
          </div>
        </b-table-column>
      </template>
      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>You don't have any projects yet.</p>
          </div>
        </section>
      </template>
    </b-table>
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
export default class Projects extends Vue {
  get projects(): Project[] {
    return this.$store.getters['projectsFixtures/list'];
  }
}
</script>
