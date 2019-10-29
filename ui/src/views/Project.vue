<template>
  <Loader id="project-page" :data="project" v-slot="{ data: project }">
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
  </Loader>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RemoteData } from '../types'
import Loader from '../components/Loader.vue'

@Component({
  components: {
    Loader
  }
})
export default class ProjectView extends Vue {
  get projectId (): string {
    return this.$route.params.id
  }

  get project (): any {
    return this.$store.getters['projects/one'](this.projectId)
  }

  created () {
    this.$store.dispatch('projects/loadOne', this.projectId)
  }
}
</script>
