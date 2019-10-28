<template>
  <div id="project-page">
    <h2 class="title is-2">{{ project.name }}</h2>

    <div class="tabs">
      <ul>
        <router-link :to="{ name: 'project/data' }" v-slot="{ href, route, navigate, isActive, isExactActive }">
          <li :class="[isActive && 'is-active']">
            <a :href="href" @click="navigate">Input data</a>
          </li>
        </router-link>
        <router-link :to="{ name: 'project/tables' }" v-slot="{ href, route, navigate, isActive, isExactActive }">
          <li :class="[isActive && 'is-active']">
            <a :href="href" @click="navigate">Output tables</a>
          </li>
        </router-link>
        <router-link :to="{ name: 'project/rules' }" v-slot="{ href, route, navigate, isActive, isExactActive }">
          <li :class="[isActive && 'is-active']">
            <a :href="href" @click="navigate">Mapping rules</a>
          </li>
        </router-link>
      </ul>
    </div>

    <section class="tab-content">
      <router-view />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RemoteData } from '../types';


@Component
export default class ProjectView extends Vue {
  get projectId(): string {
    return this.$route.params.id;
  }

  get project(): any {
    return this.$store.getters['projectsFixtures/one'](this.projectId);
  }
}
</script>
